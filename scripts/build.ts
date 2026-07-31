import { mkdir, rm } from "node:fs/promises";
import { gunzipSync, gzipSync } from "node:zlib";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(import.meta.dir, "..");
const outputRoot = resolve(projectRoot, "dist");
const lilypondPackageRoot = dirname(
  fileURLToPath(
    import.meta.resolve("@hlolli/lilypond-wasm/package.json"),
  ),
);
const opcodeCompilerRelease = {
  version: "v0.1.0",
  url:
    "https://github.com/hlolli/csound-wasm-plugin-compiler/releases/download/v0.1.0/opcode-wasm-v0.1.0.tar.gz",
  sha256: "09ab52ff2b1a53ccbf920356b6079dc41c7e9e6a4eb011235bb3685a11cb387b",
  archiveRoot: "opcode-wasm-v0.1.0/",
};
const tarTextDecoder = new TextDecoder();

async function copyTree(
  sourceRoot: string,
  destinationRoot: string,
) {
  const files = new Bun.Glob("**/*");

  for await (const relativePath of files.scan({
    cwd: sourceRoot,
    dot: true,
    onlyFiles: true,
  })) {
    const source = resolve(sourceRoot, relativePath);
    const destination = resolve(destinationRoot, relativePath);
    await mkdir(resolve(destination, ".."), { recursive: true });
    await Bun.write(destination, Bun.file(source));
  }
}

async function copyProjectTree(sourceName: string, destinationName: string) {
  await copyTree(
    resolve(projectRoot, sourceName),
    resolve(outputRoot, destinationName),
  );
}

async function copyFile(source: string, destination: string) {
  await mkdir(resolve(destination, ".."), { recursive: true });
  await Bun.write(destination, Bun.file(source));
}

async function copyProjectFile(sourceName: string, destinationName: string) {
  await copyFile(
    resolve(projectRoot, sourceName),
    resolve(outputRoot, destinationName),
  );
}

function sha256Hex(bytes: Uint8Array) {
  return new Bun.CryptoHasher("sha256").update(bytes).digest("hex");
}

async function loadOpcodeCompilerArchive() {
  const cacheRoot = resolve(projectRoot, ".local-packages");
  const cachePath = resolve(
    cacheRoot,
    `opcode-wasm-${opcodeCompilerRelease.version}.tar.gz`,
  );
  const cachedFile = Bun.file(cachePath);

  if (await cachedFile.exists()) {
    const cachedBytes = new Uint8Array(await cachedFile.arrayBuffer());
    const cachedHash = sha256Hex(cachedBytes);

    if (cachedHash === opcodeCompilerRelease.sha256) {
      return cachedBytes;
    }

    console.warn(
      `Ignoring ${cachePath} because its SHA-256 is ${cachedHash}`,
    );
  }

  const response = await fetch(opcodeCompilerRelease.url);

  if (!response.ok) {
    throw new Error(
      `Could not download OPCODE.WASM ${opcodeCompilerRelease.version}: ` +
        `${response.status} ${response.statusText}`,
    );
  }

  const archiveBytes = new Uint8Array(await response.arrayBuffer());
  const archiveHash = sha256Hex(archiveBytes);

  if (archiveHash !== opcodeCompilerRelease.sha256) {
    throw new Error(
      `OPCODE.WASM ${opcodeCompilerRelease.version} has SHA-256 ` +
        `${archiveHash}, expected ${opcodeCompilerRelease.sha256}`,
    );
  }

  await mkdir(cacheRoot, { recursive: true });
  await Bun.write(cachePath, archiveBytes);
  return archiveBytes;
}

function readTarText(
  block: Uint8Array,
  start: number,
  length: number,
) {
  let end = start;
  const limit = start + length;

  while (end < limit && block[end] !== 0) {
    end += 1;
  }

  return tarTextDecoder.decode(block.subarray(start, end));
}

function readTarSize(block: Uint8Array) {
  const sizeText = readTarText(block, 124, 12).trim();
  const size = sizeText === "" ? 0 : Number.parseInt(sizeText, 8);

  if (!Number.isSafeInteger(size) || size < 0) {
    throw new Error(`Bad tar file size: ${sizeText}`);
  }

  return size;
}

async function installOpcodeCompilerRelease() {
  const archiveBytes = await loadOpcodeCompilerArchive();
  const tarBytes = gunzipSync(archiveBytes);
  const destinationRoot = resolve(
    outputRoot,
    "csound-wasm-plugin-compiler",
  );
  let offset = 0;
  let fileCount = 0;
  let totalBytes = 0;

  while (offset + 512 <= tarBytes.byteLength) {
    const block = tarBytes.subarray(offset, offset + 512);

    if (block.every((byte) => byte === 0)) {
      break;
    }

    const name = readTarText(block, 0, 100);
    const prefix = readTarText(block, 345, 155);
    const archivePath = prefix === "" ? name : `${prefix}/${name}`;
    const size = readTarSize(block);
    const contentStart = offset + 512;
    const contentEnd = contentStart + size;

    if (contentEnd > tarBytes.byteLength) {
      throw new Error(`Truncated release archive at ${archivePath}`);
    }

    const rootEntry = opcodeCompilerRelease.archiveRoot.slice(0, -1);
    if (
      archivePath !== rootEntry &&
      !archivePath.startsWith(opcodeCompilerRelease.archiveRoot)
    ) {
      throw new Error(`Unexpected release archive path: ${archivePath}`);
    }

    const type = block[156];
    const relativePath = archivePath.slice(
      opcodeCompilerRelease.archiveRoot.length,
    );
    const outputPath = type === 53
      ? relativePath.replace(/\/$/, "")
      : relativePath;

    if (outputPath !== "") {
      const parts = outputPath.split("/");

      if (parts.some((part) => part === "" || part === "." || part === "..")) {
        throw new Error(`Unsafe release archive path: ${archivePath}`);
      }

      const destination = resolve(destinationRoot, ...parts);
      if (!destination.startsWith(`${destinationRoot}${sep}`)) {
        throw new Error(`Unsafe release archive path: ${archivePath}`);
      }

      if (type === 0 || type === 48) {
        await mkdir(dirname(destination), { recursive: true });
        await Bun.write(
          destination,
          new Uint8Array(tarBytes.subarray(contentStart, contentEnd)),
        );
        fileCount += 1;
        totalBytes += size;
      } else if (type === 53) {
        await mkdir(destination, { recursive: true });
      } else {
        throw new Error(`Unsupported tar entry at ${archivePath}`);
      }
    }

    offset = contentStart + Math.ceil(size / 512) * 512;
  }

  console.log(
    `Installed OPCODE.WASM ${opcodeCompilerRelease.version}: ` +
      `${fileCount} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MiB`,
  );
}

type PackageRuntimeManifest = {
  lilypondVersion: string;
  mountOrder: string[];
  mounts: Record<string, string>;
};

type RuntimeFile = {
  guestPath: string;
  offset: number;
  length: number;
};

async function buildLilypondRuntimePack() {
  const packageManifestPath = resolve(
    lilypondPackageRoot,
    "runtime-manifest.json",
  );
  const packageManifest =
    await Bun.file(packageManifestPath).json() as PackageRuntimeManifest;

  const runtimeFiles: RuntimeFile[] = [];
  const packParts: Uint8Array[] = [];
  let offset = 0;

  for (const guestRoot of packageManifest.mountOrder) {
    const packagePath = packageManifest.mounts[guestRoot];
    if (!packagePath) {
      throw new Error(`No package path found for run-time mount ${guestRoot}`);
    }

    const sourceRoot = resolve(lilypondPackageRoot, packagePath);
    const files = new Bun.Glob("**/*");
    const relativePaths: string[] = [];

    for await (const relativePath of files.scan({
      cwd: sourceRoot,
      dot: true,
      onlyFiles: true,
    })) {
      relativePaths.push(relativePath);
    }

    relativePaths.sort();

    for (const relativePath of relativePaths) {
      const source = resolve(sourceRoot, relativePath);
      const file = Bun.file(source);
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const guestPath = `${guestRoot}/${relativePath.split(sep).join("/")}`;

      runtimeFiles.push({
        guestPath,
        offset,
        length: fileBytes.byteLength,
      });
      packParts.push(fileBytes);
      offset += fileBytes.byteLength;
    }
  }

  const pack = new Uint8Array(await new Blob(packParts).arrayBuffer());
  const compressedPack = gzipSync(pack, { level: 9 });
  const runtimeOutputRoot = resolve(outputRoot, "lilypond/runtime");

  await mkdir(runtimeOutputRoot, { recursive: true });
  await Bun.write(
    resolve(runtimeOutputRoot, "runtime-files.pack.gz"),
    compressedPack,
  );
  await Bun.write(
    resolve(runtimeOutputRoot, "runtime-files.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        compression: "gzip",
        uncompressedBytes: offset,
        files: runtimeFiles,
      },
      null,
      2,
    ),
  );

  await Promise.all([
    copyFile(
      resolve(lilypondPackageRoot, "dist/lilypond.wasm"),
      resolve(outputRoot, "lilypond/dist/lilypond.wasm"),
    ),
    copyFile(
      packageManifestPath,
      resolve(outputRoot, "lilypond/runtime-manifest.json"),
    ),
    copyFile(
      resolve(
        lilypondPackageRoot,
        `runtime/lilypond/${packageManifest.lilypondVersion}/fonts/text/NimbusSans-Regular.otf`,
      ),
      resolve(outputRoot, "lilypond/fonts/NimbusSans-Regular.otf"),
    ),
    copyFile(
      resolve(
        lilypondPackageRoot,
        `runtime/lilypond/${packageManifest.lilypondVersion}/fonts/text/NimbusSans-Bold.otf`,
      ),
      resolve(outputRoot, "lilypond/fonts/NimbusSans-Bold.otf"),
    ),
    copyFile(
      resolve(lilypondPackageRoot, "COPYING"),
      resolve(outputRoot, "lilypond/COPYING"),
    ),
    copyFile(
      resolve(lilypondPackageRoot, "LICENSE"),
      resolve(outputRoot, "lilypond/LICENSE"),
    ),
    copyFile(
      resolve(lilypondPackageRoot, "SOURCE.md"),
      resolve(outputRoot, "lilypond/SOURCE.md"),
    ),
    copyFile(
      resolve(lilypondPackageRoot, "THIRD_PARTY_NOTICES.md"),
      resolve(outputRoot, "lilypond/THIRD_PARTY_NOTICES.md"),
    ),
    copyTree(
      resolve(lilypondPackageRoot, "licenses"),
      resolve(outputRoot, "lilypond/licenses"),
    ),
  ]);

  console.log(
    `Packed ${runtimeFiles.length} LilyPond runtime files: ` +
      `${(offset / 1024 / 1024).toFixed(1)} MiB → ` +
      `${(compressedPack.byteLength / 1024 / 1024).toFixed(1)} MiB`,
  );
}

await rm(outputRoot, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: [
    resolve(projectRoot, "index.html"),
    resolve(projectRoot, "lilypond/index.html"),
    resolve(projectRoot, "lilypond/lilypond.worker.ts"),
  ],
  outdir: outputRoot,
  root: projectRoot,
  minify: true,
  naming: {
    entry: "[dir]/[name].[ext]",
    chunk: "assets/[name]-[hash].[ext]",
    asset: "assets/[name]-[hash].[ext]",
  },
  target: "browser",
});

if (!result.success) {
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

await Promise.all([
  copyProjectTree("tools/ftgen-plotter", "ftgen-plotter"),
  copyProjectTree("tools/step-sequencer", "step-sequencer"),
  copyProjectFile(
    "assets/fonts/lekton.regular.ttf",
    "ftgen-plotter/lekton.regular.ttf",
  ),
  buildLilypondRuntimePack(),
  installOpcodeCompilerRelease(),
]);

console.log(`Built ${outputRoot}`);
