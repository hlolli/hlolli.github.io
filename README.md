# hlolli.github.io

A small index for two Csound browser tools:

- `/ftgen-plotter/`
- `/step-sequencer/`

The homepage uses Bun's HTML bundler. The tool files stay unchanged and the
build script copies them into `dist`.

## Local use

Install [Bun 1.3.14](https://bun.sh/) or newer, then run:

```sh
bun run dev
```

The site opens at `http://127.0.0.1:3000/`.

For a release build:

```sh
bun run build
bun run preview
```

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys `dist` after
each push to `master`. Before its first run, set **Settings → Pages → Build and
deployment → Source** to **GitHub Actions**.

## FTGen source

The original ClojureScript project is in
[hlolli/csound-ftgen-plotter](https://github.com/hlolli/csound-ftgen-plotter).
The checked-in `js/main.js.map` file also contains the original source text.
