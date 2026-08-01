# hlolli.github.io

A small index for browser music tools:

- `/lilypond/`
- `/plugin-compiler/`
- `/ftgen-plotter/`
- `/step-sequencer/`

The homepage uses Bun's HTML bundler. The build script builds each pinned app
in its own source tree and copies the legacy tool bundles without rebuilding
them.

The source tree keeps the legacy apps and two pinned app repositories under
`tools/`:

```text
tools/
├── ftgen-plotter/
├── lilypond-wasm/    Git submodule
├── plugin-compiler/  Git submodule
└── step-sequencer/
```

The build keeps the public routes at `/lilypond/`, `/plugin-compiler/`,
`/ftgen-plotter/`, and `/step-sequencer/`.

## Local use

Install [Bun 1.3.14](https://bun.sh/) or newer, then run:

```sh
git submodule update --init --recursive
bun install
bun run dev
```

The site opens at `http://127.0.0.1:3000/`.

For a release build:

```sh
bun run build
bun run preview
```

## Csound plugin compiler

The `/plugin-compiler/` route builds the
[csound-wasm-plugin-compiler](https://github.com/hlolli/csound-wasm-plugin-compiler)
Git submodule.

The site build installs its locked npm packages, runs its tests and production
build, then copies its `dist` folder into the site output.

To update the pinned compiler commit:

```sh
git submodule update --remote tools/plugin-compiler
bun run build
```

Commit the new `tools/plugin-compiler` pointer after the build passes.

## LilyPond editor

The `/lilypond/` route builds the editor from the
[lilypond-wasm](https://github.com/hlolli/lilypond-wasm) Git submodule. The
editor owns its locked npm packages, tests, browser build, Wasm run-time pack,
fonts, and licence files.

To update the pinned editor commit:

```sh
git submodule update --remote tools/lilypond-wasm
bun run build
```

Commit the new `tools/lilypond-wasm` pointer after the build passes.

## Local folder editing

The LilyPond page starts as the same in-memory scratchpad as before. Choose
**Open folder** to give the page read and write access to a local project.
Folder mode adds separate **Editor** and **Files** views in the left column,
editor tabs, direct saves, recovery drafts, and checks for files changed by
another app. Use **New text file** to add a supported text file inside the
open folder or one of its existing subfolders. If `main.ly` is missing, the
editor offers to create it with a starter score ready to save.

The browser stores the selected folder handle in IndexedDB. It restores the
folder after a refresh when access remains granted. If access expires, use
**Reconnect folder**. Use **Disconnect folder** to forget the handle and return
to the scratchpad.

Folder access needs HTTPS or localhost and a browser that provides
`showDirectoryPicker`. Browsers without it keep the scratchpad available and
show a clear message. File contents stay in the browser and are not uploaded.

When folder mode renders a `.ly` file, the worker copies the local project into
its private in-memory file system and overlays open editor buffers. This lets
relative includes use unsaved text without saving it first. A render copy stops
at 2,500 files or 128 MiB; choose a smaller project folder if it reaches either
limit.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys `dist` after
each push to `master`. It also checks both app submodules each hour. When an
upstream `main` branch has a newer fast-forward commit, the workflow tests and
builds both apps, commits the changed pointer or pointers, and deploys the site.
Before its first run, set **Settings → Pages → Build and deployment → Source**
to **GitHub Actions**.

## FTGen source

The original ClojureScript project is in
[hlolli/csound-ftgen-plotter](https://github.com/hlolli/csound-ftgen-plotter).
The checked-in `tools/ftgen-plotter/js/main.js.map` file also contains the
original source text.
