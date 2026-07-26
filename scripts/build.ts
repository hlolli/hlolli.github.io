import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dir, "..");
const outputRoot = resolve(projectRoot, "dist");

async function copyTree(sourceName: string) {
  const sourceRoot = resolve(projectRoot, sourceName);
  const destinationRoot = resolve(outputRoot, sourceName);
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

async function copyFile(fileName: string) {
  await Bun.write(
    resolve(outputRoot, fileName),
    Bun.file(resolve(projectRoot, fileName)),
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
  copyTree("ftgen-plotter"),
  copyTree("js"),
  copyTree("step-sequencer"),
  copyFile("styles.css"),
  copyFile("lekton.regular.ttf"),
]);

console.log(`Built ${outputRoot}`);
