import { mkdir, rm } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { resolve, sep } from "node:path";

const projectRoot = resolve(import.meta.dir, "..");
const outputRoot = resolve(projectRoot, "dist");
const lilypondPackageRoot = resolve(
  projectRoot,
  ".local-packages/lilypond-wasm",
);

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

type PackageRuntimeManifest = {
  lilypondVersion: string;
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

  for (const [guestRoot, packagePath] of Object.entries(
    packageManifest.mounts,
  )) {
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
]);

console.log(`Built ${outputRoot}`);
