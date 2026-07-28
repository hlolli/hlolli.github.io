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
bun add --exact @hlolli/lilypond-wasm@0.1.0-alpha.1
```

The build packs the package’s LilyPond and Guile run-time files for the browser,
then copies the Wasm command and its licence tree into the site output.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys `dist` after
each push to `master`. Before its first run, set **Settings → Pages → Build and
deployment → Source** to **GitHub Actions**.

## FTGen source

The original ClojureScript project is in
[hlolli/csound-ftgen-plotter](https://github.com/hlolli/csound-ftgen-plotter).
The checked-in `tools/ftgen-plotter/js/main.js.map` file also contains the
original source text.
