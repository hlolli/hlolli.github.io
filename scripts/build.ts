import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dir, "..");
const outputRoot = resolve(projectRoot, "dist");
const pluginCompilerRoot = resolve(projectRoot, "tools/plugin-compiler");
const lilypondEditorRoot = resolve(
  projectRoot,
  "tools/lilypond-wasm/editor",
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

async function run(command: string[], cwd: string) {
  const child = Bun.spawn(command, {
    cwd,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await child.exited;

  if (exitCode !== 0) {
    throw new Error(`${command.join(" ")} exited with ${exitCode}`);
  }
}

async function buildPluginCompiler() {
  const packagePath = resolve(pluginCompilerRoot, "package.json");

  if (!(await Bun.file(packagePath).exists())) {
    throw new Error(
      "Plugin compiler source is missing. Run git submodule update --init.",
    );
  }

  await run(
    ["bun", "install", "--frozen-lockfile"],
    pluginCompilerRoot,
  );
  await run(["bun", "run", "build"], pluginCompilerRoot);
  await copyTree(
    resolve(pluginCompilerRoot, "dist"),
    resolve(outputRoot, "plugin-compiler"),
  );

  console.log("Built OPCODE.WASM at /plugin-compiler/");
}

async function buildLilypondEditor() {
  const packagePath = resolve(lilypondEditorRoot, "package.json");

  if (!(await Bun.file(packagePath).exists())) {
    throw new Error(
      "LilyPond editor source is missing. Run git submodule update --init.",
    );
  }

  await run(
    ["bun", "install", "--frozen-lockfile"],
    lilypondEditorRoot,
  );
  await run(["bun", "run", "build"], lilypondEditorRoot);
  await copyTree(
    resolve(lilypondEditorRoot, "dist"),
    resolve(outputRoot, "lilypond"),
  );

  console.log("Built LilyPond editor at /lilypond/");
}

await rm(outputRoot, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: [resolve(projectRoot, "index.html")],
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
  buildLilypondEditor(),
  buildPluginCompiler(),
]);

console.log(`Built ${outputRoot}`);
