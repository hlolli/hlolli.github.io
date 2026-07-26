import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dir, "..");
const outputRoot = resolve(projectRoot, "dist");

async function copyTree(sourceName: string, destinationName: string) {
  const sourceRoot = resolve(projectRoot, sourceName);
  const destinationRoot = resolve(outputRoot, destinationName);
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

async function copyFile(sourceName: string, destinationName: string) {
  await Bun.write(
    resolve(outputRoot, destinationName),
    Bun.file(resolve(projectRoot, sourceName)),
  );
}

await rm(outputRoot, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: [resolve(projectRoot, "index.html")],
  outdir: outputRoot,
  minify: true,
  target: "browser",
});

if (!result.success) {
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

await Promise.all([
  copyTree("tools/ftgen-plotter", "ftgen-plotter"),
  copyTree("tools/step-sequencer", "step-sequencer"),
  copyFile(
    "assets/fonts/lekton.regular.ttf",
    "ftgen-plotter/lekton.regular.ttf",
  ),
]);

console.log(`Built ${outputRoot}`);
