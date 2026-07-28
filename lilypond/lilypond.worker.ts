/// <reference lib="webworker" />

import {
  guileVersion,
  lilypondVersion,
  lilypondWasmUrl,
  runtimeEnvironment,
  runtimeRequirements,
} from "@hlolli/lilypond-wasm";
import { Volume, createFsFromVolume } from "@napi-rs/wasm-runtime/fs";
import { WASI } from "@tybys/wasm-util";

type RuntimeFile = {
  guestPath: string;
  offset: number;
  length: number;
};

type RuntimeFilesManifest = {
  schemaVersion: 1;
  compression: "gzip";
  uncompressedBytes: number;
  files: RuntimeFile[];
};

type RenderRequest = {
  type: "render";
  requestId: number;
  source: string;
};

const worker = self as unknown as DedicatedWorkerGlobalScope;
const textEncoder = new TextEncoder();

function postProgress(requestId: number, message: string) {
  worker.postMessage({
    type: "progress",
    requestId,
    message,
  });
}

function postDiagnostic(
  requestId: number,
  level: "info" | "warning" | "error",
  channel: "stdout" | "stderr" | "host",
  message: string,
) {
  if (!message.trim()) {
    return;
  }
  worker.postMessage({
    type: "diagnostic",
    requestId,
    level,
    channel,
    message,
  });
}

async function fetchChecked(url: URL) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url.pathname}: HTTP ${response.status}`);
  }
  return response;
}

async function loadRuntimeFiles(requestId: number) {
  const runtimeRoot = new URL("./runtime/", worker.location.href);
  const manifestUrl = new URL("runtime-files.json", runtimeRoot);
  const packUrl = new URL("runtime-files.pack.gz", runtimeRoot);

  postProgress(requestId, "Loading the local run-time pack");
  const [manifestResponse, packResponse] = await Promise.all([
    fetchChecked(manifestUrl),
    fetchChecked(packUrl),
  ]);
  const manifest =
    await manifestResponse.json() as RuntimeFilesManifest;

  if (
    manifest.schemaVersion !== 1 ||
    manifest.compression !== "gzip" ||
    !Array.isArray(manifest.files)
  ) {
    throw new Error("The run-time file manifest has an unknown format.");
  }

  if (!packResponse.body || typeof DecompressionStream === "undefined") {
    throw new Error(
      "This browser cannot unpack the LilyPond run-time data.",
    );
  }

  postProgress(requestId, "Unpacking LilyPond and Guile data");
  const decompressedStream = packResponse.body.pipeThrough(
    new DecompressionStream("gzip"),
  );
  const bytes = new Uint8Array(
    await new Response(decompressedStream).arrayBuffer(),
  );

  if (bytes.byteLength !== manifest.uncompressedBytes) {
    throw new Error(
      `The run-time pack is ${bytes.byteLength} bytes; expected ` +
        `${manifest.uncompressedBytes}.`,
    );
  }

  return { bytes, files: manifest.files };
}

function makeFileSystem(
  requestId: number,
  source: string,
  runtimeBytes: Uint8Array,
  runtimeFiles: RuntimeFile[],
) {
  const volume = new Volume();
  const fs = createFsFromVolume(volume);

  for (const directory of [
    "/work/cache/fontconfig",
    "/work/home",
    "/work/lily-lib",
    "/work/tmp",
    "/lilypond",
    "/guile-ccache",
  ]) {
    fs.mkdirSync(directory, { recursive: true });
  }

  postProgress(
    requestId,
    `Mounting ${runtimeFiles.length} run-time files`,
  );

  for (const file of runtimeFiles) {
    const end = file.offset + file.length;
    if (
      file.offset < 0 ||
      file.length < 0 ||
      end > runtimeBytes.byteLength
    ) {
      throw new Error(`The run-time entry ${file.guestPath} is out of range.`);
    }

    const separator = file.guestPath.lastIndexOf("/");
    const parent = file.guestPath.slice(0, separator) || "/";
    fs.mkdirSync(parent, { recursive: true });
    fs.writeFileSync(
      file.guestPath,
      runtimeBytes.subarray(file.offset, end),
    );
  }

  fs.writeFileSync("/work/main.ly", textEncoder.encode(source));
  return fs;
}

function outputOrder(left: string, right: string) {
  const pageNumber = (name: string) => {
    const match = name.match(/^score(?:-(\d+))?\.svg$/);
    return match?.[1] ? Number(match[1]) : 1;
  };
  return pageNumber(left) - pageNumber(right);
}

async function render(request: RenderRequest) {
  const startedAt = performance.now();
  const { requestId, source } = request;

  try {
    let { bytes, files } = await loadRuntimeFiles(requestId);
    const fs = makeFileSystem(requestId, source, bytes, files);
    bytes = new Uint8Array();
    files = [];

    const wasi = new WASI({
      version: "preview1",
      args: [
        runtimeRequirements.argv0,
        "-dbackend=svg",
        "-djob-count=1",
        "-dpoint-and-click=#f",
        "-drandom-seed=1",
        "--formats=svg",
        "-o",
        "/work/score",
        "/work/main.ly",
      ],
      env: { ...runtimeEnvironment },
      preopens: {
        "/work": "/work",
        "/lilypond": "/lilypond",
        "/guile-ccache": "/guile-ccache",
      },
      fs,
      returnOnExit: true,
      print: (message) => {
        postDiagnostic(requestId, "info", "stdout", message);
      },
      printErr: (message) => {
        const level = /\b(?:error|fatal)\b/i.test(message)
          ? "error"
          : /\bwarning\b/i.test(message)
            ? "warning"
            : "info";
        postDiagnostic(requestId, level, "stderr", message);
      },
    });

    postProgress(requestId, "Compiling the WebAssembly module");
    const wasmResponse = await fetchChecked(lilypondWasmUrl);
    const { instance } = await WebAssembly.instantiateStreaming(
      wasmResponse,
      wasi.getImportObject(),
    );

    postProgress(requestId, "Engraving the score");
    const exitCode = await wasi.start(instance);
    const outputFiles = (fs.readdirSync("/work") as string[])
      .filter((name) => /^score(?:-\d+)?\.svg$/.test(name))
      .sort(outputOrder);

    if (outputFiles.length === 0) {
      throw new Error(
        `LilyPond exited with code ${exitCode ?? "unknown"} and wrote no SVG.`,
      );
    }

    const svgs = outputFiles.map((name) =>
      String(fs.readFileSync(`/work/${name}`, "utf8"))
    );

    worker.postMessage({
      type: "result",
      requestId,
      exitCode,
      durationMs: performance.now() - startedAt,
      files: outputFiles,
      svgs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    worker.postMessage({
      type: "error",
      requestId,
      message,
    });
  }
}

worker.addEventListener("message", (event: MessageEvent<RenderRequest>) => {
  if (event.data?.type === "render") {
    void render(event.data);
  }
});

worker.postMessage({
  type: "ready",
  lilypondVersion,
  guileVersion,
  wasi: `WASI ${runtimeRequirements.wasi}`,
});
