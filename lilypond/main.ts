import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { basicSetup, EditorView } from "codemirror";
import { lilypond } from "codemirror-lang-lilypond";
import { lilypondVersion } from "@hlolli/lilypond-wasm";

type DiagnosticLevel = "info" | "warning" | "error" | "success";

type WorkerMessage =
  | {
      type: "ready";
      lilypondVersion: string;
      guileVersion: string;
      wasi: string;
    }
  | {
      type: "progress";
      requestId: number;
      message: string;
    }
  | {
      type: "diagnostic";
      requestId: number;
      level: Exclude<DiagnosticLevel, "success">;
      channel: "stdout" | "stderr" | "host";
      message: string;
    }
  | {
      type: "result";
      requestId: number;
      exitCode: number | undefined;
      durationMs: number;
      files: string[];
      svgs: string[];
    }
  | {
      type: "error";
      requestId: number;
      message: string;
    };

const defaultSource = String.raw`\version "${lilypondVersion}"

\header {
  title = "LilyPond in the browser"
  subtitle = "A local WASI render"
  tagline = ##f
}

\paper {
  #(set-paper-size "a5")
}

\relative c' {
  \key c \major
  \time 4/4
  c4 d e f |
  g2 g |
  a4 a g g |
  f1 \bar "|."
}
`;

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}

const renderButton = requiredElement<HTMLButtonElement>("#render-button");
const renderButtonLabel =
  requiredElement<HTMLSpanElement>(".render-button__label");
const runtimeState = requiredElement<HTMLParagraphElement>("#runtime-state");
const runtimeStateLabel =
  requiredElement<HTMLSpanElement>("#runtime-state-label");
const preview = requiredElement<HTMLDivElement>("#preview");
const previewSummary =
  requiredElement<HTMLParagraphElement>("#preview-summary");
const outputName = requiredElement<HTMLParagraphElement>("#output-name");
const consoleOutput =
  requiredElement<HTMLOListElement>("#console-output");
const diagnosticCount =
  requiredElement<HTMLSpanElement>("#diagnostic-count");
const clearConsole =
  requiredElement<HTMLButtonElement>("#clear-console");
const editorHost = requiredElement<HTMLDivElement>("#editor");

const editorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      backgroundColor: "var(--color-paper-2)",
      color: "var(--color-ink-2)",
      fontSize: "var(--text-sm)",
    },
    ".cm-scroller": {
      fontFamily: "var(--font-mono)",
      lineHeight: "var(--lh-normal)",
    },
    ".cm-content": {
      paddingBlock: "var(--space-md)",
      caretColor: "var(--color-accent)",
    },
    ".cm-line": {
      paddingInline: "var(--space-md)",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--color-accent)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "var(--color-selection)",
    },
    ".cm-content ::selection": {
      color: "var(--color-selection-ink)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-paper)",
      color: "var(--color-muted)",
      borderRight: "var(--rule-hair) solid var(--color-rule)",
    },
    ".cm-activeLine, .cm-activeLineGutter": {
      backgroundColor: "var(--color-paper-3)",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "var(--color-paper-3)",
      color: "var(--color-neutral)",
      border: "var(--rule-hair) solid var(--color-rule-2)",
    },
    ".cm-panels, .cm-tooltip": {
      backgroundColor: "var(--color-paper)",
      color: "var(--color-ink-2)",
    },
    ".cm-tooltip.cm-tooltip-autocomplete > ul": {
      fontFamily: "var(--font-mono)",
    },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
      backgroundColor: "var(--color-selection)",
      color: "var(--color-selection-ink)",
    },
    ".cm-completionDetail": {
      color: "var(--color-muted)",
    },
    ".cm-tooltip-autocomplete > ul > li[aria-selected] .cm-completionDetail": {
      color: "var(--color-selection-ink)",
    },
  },
  { dark: true },
);

const lilypondHighlightStyle = HighlightStyle.define([
  {
    tag: [t.keyword, t.meta],
    color: "var(--color-syntax-command)",
  },
  {
    tag: [t.string, t.character, t.number, t.bool],
    color: "var(--color-syntax-literal)",
  },
  {
    tag: t.atom,
    color: "var(--color-syntax-name)",
  },
  {
    tag: t.variableName,
    color: "var(--color-syntax-variable)",
  },
  {
    tag: [t.operator, t.modifier],
    color: "var(--color-syntax-operator)",
  },
  {
    tag: t.bracket,
    color: "var(--color-syntax-punctuation)",
  },
  {
    tag: t.comment,
    color: "var(--color-syntax-comment)",
  },
  {
    tag: t.invalid,
    color: "var(--color-syntax-invalid)",
    textDecoration: "underline",
  },
]);

const editor = new EditorView({
  doc: defaultSource,
  parent: editorHost,
  extensions: [
    keymap.of([
      {
        key: "Mod-Enter",
        run: () => {
          renderScore();
          return true;
        },
      },
    ]),
    basicSetup,
    lilypond(),
    syntaxHighlighting(lilypondHighlightStyle),
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({
      "aria-label": "LilyPond source",
      spellcheck: "false",
    }),
    editorTheme,
  ],
});

let worker: Worker | null = null;
let requestId = 0;
let activeRequestId: number | null = null;
let messageCount = 0;
let packageReady = false;
let previewObjectUrls: string[] = [];
let previewSummaryBeforeRender = "No render yet";

function setRuntimeState(
  state: "loading" | "ready" | "working" | "error",
  label: string,
) {
  runtimeState.dataset.state = state;
  runtimeStateLabel.textContent = label;
}

function updateDiagnosticCount() {
  diagnosticCount.textContent =
    `${messageCount} ${messageCount === 1 ? "message" : "messages"}`;
}

function addDiagnostic(level: DiagnosticLevel, message: string) {
  const cleanMessage = message.trimEnd();
  if (!cleanMessage) {
    return;
  }

  for (const line of cleanMessage.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const item = document.createElement("li");
    item.className = "diagnostic";
    item.dataset.level = level;

    const time = document.createElement("time");
    time.className = "diagnostic__time";
    time.dateTime = new Date().toISOString();
    time.textContent = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());

    const levelLabel = document.createElement("span");
    levelLabel.className = "diagnostic__level";
    levelLabel.textContent = level;

    const text = document.createElement("span");
    text.className = "diagnostic__message";
    text.textContent = line;

    item.append(time, levelLabel, text);
    consoleOutput.append(item);
    messageCount += 1;
  }

  updateDiagnosticCount();
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function assertSvg(source: string) {
  const documentNode = new DOMParser().parseFromString(
    source,
    "image/svg+xml",
  );
  const parseError = documentNode.querySelector("parsererror");

  if (parseError || documentNode.documentElement.localName !== "svg") {
    throw new Error("LilyPond returned an unreadable SVG document.");
  }
}

function releasePreviewObjectUrls() {
  for (const url of previewObjectUrls) {
    URL.revokeObjectURL(url);
  }
  previewObjectUrls = [];
}

function showScore(svgs: string[], files: string[]) {
  svgs.forEach(assertSvg);
  const nextObjectUrls = svgs.map((source) =>
    URL.createObjectURL(new Blob([source], { type: "image/svg+xml" }))
  );
  const pages = nextObjectUrls.map((url, index) => {
    const page = document.createElement("div");
    page.className = "score-page";
    const image = document.createElement("img");
    image.className = "score-page__image";
    image.src = url;
    image.alt =
      svgs.length === 1 ? "Rendered score" : `Rendered score, page ${index + 1}`;
    page.append(image);
    return page;
  });

  releasePreviewObjectUrls();
  previewObjectUrls = nextObjectUrls;
  preview.replaceChildren(...pages);
  previewSummary.textContent =
    `${pages.length} ${pages.length === 1 ? "page" : "pages"}`;
  outputName.textContent =
    files.length === 1 ? files[0] : `${files.length} SVG files`;
  outputName.title = files.join(", ");
}

function showRenderError(message: string) {
  releasePreviewObjectUrls();
  const error = document.createElement("p");
  error.className = "preview__error";
  error.textContent =
    `${message} Read the diagnostics, fix the source, and render again.`;
  preview.replaceChildren(error);
  previewSummary.textContent = "Render failed";
  outputName.textContent = "No output";
  outputName.removeAttribute("title");
}

function createWorker() {
  const nextWorker = new Worker(
    new URL("./lilypond.worker.js", document.baseURI),
    {
      type: "module",
      name: "lilypond-renderer",
    },
  );

  nextWorker.addEventListener("message", handleWorkerMessage);
  nextWorker.addEventListener("error", (event) => {
    const message = event.message || "The renderer worker stopped.";
    addDiagnostic("error", message);
    showRenderError("The renderer stopped.");
    finishRender("error", "Renderer stopped");
  });

  worker = nextWorker;
  return nextWorker;
}

function getWorker() {
  return worker ?? createWorker();
}

function disposeWorker() {
  worker?.terminate();
  worker = null;
}

function finishRender(
  state: "ready" | "error",
  label: string,
) {
  activeRequestId = null;
  renderButton.disabled = !packageReady;
  renderButton.dataset.action = "render";
  renderButtonLabel.textContent = "Render score";
  preview.removeAttribute("aria-busy");
  setRuntimeState(state, label);
  disposeWorker();
}

function handleWorkerMessage(event: MessageEvent<WorkerMessage>) {
  const message = event.data;

  if (message.type === "ready") {
    packageReady = true;
    renderButton.disabled = false;
    if (activeRequestId === null) {
      setRuntimeState(
        "ready",
        `LilyPond ${message.lilypondVersion} · Guile ${message.guileVersion}`,
      );
    }
    if (messageCount === 0) {
      addDiagnostic(
        "success",
        `Loaded the local npm package · ${message.wasi} · WebAssembly exceptions required`,
      );
    }
    return;
  }

  if (message.requestId !== activeRequestId) {
    return;
  }

  if (message.type === "progress") {
    setRuntimeState("working", message.message);
    addDiagnostic("info", message.message);
    return;
  }

  if (message.type === "diagnostic") {
    const level =
      message.level === "error" && message.channel === "stderr"
        ? "error"
        : message.level;
    addDiagnostic(level, message.message);
    return;
  }

  if (message.type === "error") {
    addDiagnostic("error", message.message);
    showRenderError("LilyPond did not produce a score.");
    finishRender("error", "Render failed");
    return;
  }

  try {
    showScore(message.svgs, message.files);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    addDiagnostic("error", errorMessage);
    showRenderError("The SVG preview could not be opened.");
    finishRender("error", "Preview failed");
    return;
  }

  const duration = `${(message.durationMs / 1000).toFixed(1)} s`;
  if (message.exitCode === 0 || message.exitCode === undefined) {
    addDiagnostic(
      "success",
      `Rendered ${message.files.join(", ")} in ${duration}`,
    );
    finishRender("ready", `Rendered in ${duration}`);
  } else {
    addDiagnostic(
      "warning",
      `LilyPond exited with code ${message.exitCode}; showing available output`,
    );
    finishRender("error", `Exit ${message.exitCode}`);
  }
}

function renderScore() {
  if (activeRequestId !== null || !packageReady) {
    return;
  }

  const source = editor.state.doc.toString();
  requestId += 1;
  activeRequestId = requestId;

  previewSummaryBeforeRender = previewSummary.textContent ?? "No render yet";
  renderButton.disabled = false;
  renderButton.dataset.action = "cancel";
  renderButtonLabel.textContent = "Cancel render";
  preview.setAttribute("aria-busy", "true");
  previewSummary.textContent = "Rendering…";
  setRuntimeState("working", "Starting renderer");
  addDiagnostic("info", "Render requested for main.ly");

  getWorker().postMessage({
    type: "render",
    requestId,
    source,
  });
}

function cancelRender() {
  if (activeRequestId === null) {
    return;
  }

  addDiagnostic("warning", "Render cancelled");
  previewSummary.textContent = previewSummaryBeforeRender;
  finishRender("ready", "Render cancelled");
}

renderButton.addEventListener("click", () => {
  if (activeRequestId === null) {
    renderScore();
  } else {
    cancelRender();
  }
});

clearConsole.addEventListener("click", () => {
  consoleOutput.replaceChildren();
  messageCount = 0;
  updateDiagnosticCount();
});

async function loadInterfaceFonts() {
  const definitions = [
    ["NimbusSans-Regular.otf", "400"],
    ["NimbusSans-Bold.otf", "700"],
  ] as const;
  const fonts = definitions.map(([file, weight]) => {
    const url = new URL(`./fonts/${file}`, document.baseURI);
    const face = new FontFace(
      "Nimbus Sans",
      `url(${JSON.stringify(url.href)}) format("opentype")`,
      { display: "swap", style: "normal", weight },
    );
    document.fonts.add(face);
    return face.load();
  });
  await Promise.all(fonts);
}

window.addEventListener("beforeunload", () => {
  disposeWorker();
  releasePreviewObjectUrls();
});

updateDiagnosticCount();
createWorker();
void loadInterfaceFonts().catch(() => {
  addDiagnostic("warning", "Could not load the LilyPond interface font");
});
