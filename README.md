# hlolli.github.io

A small index for browser music tools:

- `/lilypond/`
- `/ftgen-plotter/`
- `/step-sequencer/`

The homepage and LilyPond workbench use Bun's HTML bundler. The build script
copies the legacy tool bundles into `dist` without recompiling them.

The source tree keeps both legacy apps under `tools/`:

```text
tools/
├── ftgen-plotter/
└── step-sequencer/
```

The build keeps their public URLs at `/ftgen-plotter/` and
`/step-sequencer/`.

## Local use

Install [Bun 1.3.14](https://bun.sh/) or newer, then run:

```sh
bun install
bun run dev
```

The site opens at `http://127.0.0.1:3000/`.

For a release build:

```sh
bun run build
bun run preview
```

## LilyPond package

The `/lilypond/` route uses the exact `@hlolli/lilypond-wasm` version in
`package.json`. Bun installs it with the other site dependencies.

To update the run-time package:

```sh
bun add --exact @hlolli/lilypond-wasm@0.1.0-alpha.2
```

The build packs the package’s LilyPond and Guile run-time files for the browser,
then copies the Wasm command and its licence tree into the site output.

## Local folder editing

The LilyPond page starts as the same in-memory scratchpad as before. Choose
**Open folder** to give the page read and write access to a local project.
Folder mode adds a file tree, editor tabs, direct saves, recovery drafts, and
checks for files changed by another app.

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
each push to `master`. Before its first run, set **Settings → Pages → Build and
deployment → Source** to **GitHub Actions**.

## FTGen source

The original ClojureScript project is in
[hlolli/csound-ftgen-plotter](https://github.com/hlolli/csound-ftgen-plotter).
The checked-in `tools/ftgen-plotter/js/main.js.map` file also contains the
original source text.
