import type { EditorState } from "@codemirror/state";
import type { EditorView, ViewUpdate } from "@codemirror/view";
import {
  FileSystemWorkspace,
  WorkspaceDatabase,
  WorkspaceError,
  WorkspaceHandleStore,
  isLilyPondFile,
  isWorkspaceError,
  pathFromId,
  pathToDisplay,
  pathToId,
  type ReadFileResult,
  type WorkspaceDescriptor,
  type WorkspaceEntry,
} from "./filesystem";
import {
  createDraftStore,
  draftDiffersFromDisk,
  type DraftStore,
} from "./workspace/draft-store";
import type { WorkspaceDatabase as StateDatabase } from "./workspace/persistence";
import {
  createTabSessionStore,
  type TabSessionStore,
} from "./workspace/tab-session-store";
import {
  applySaveResult,
  closeFile,
  createWorkspaceState,
  editFile,
  focusFile,
  getActiveFile,
  hasDirtyFiles,
  openOrFocusFile,
  reloadFile,
  restoreSessionMetadata,
  serializeSessionMetadata,
  type OpenFile,
  type WorkspaceState,
} from "./workspace/workspace-state";

type DiagnosticLevel = "info" | "warning" | "error" | "success";
type NoticeState = "info" | "warning" | "error" | "success";
type ConflictChoice = "reload" | "overwrite" | "cancel";
type DraftChoice = "restore" | "discard";
type ActionState = "idle" | "loading" | "error" | "success";

type DirectorySnapshot = {
  status: "loading" | "ready" | "error";
  entries: WorkspaceEntry[];
  message?: string;
};

export type WorkspaceRenderContext = {
  source: string;
  path: string[];
  displayPath: string;
  rootHandle: FileSystemDirectoryHandle;
  openBuffers: Array<{
    path: string[];
    content: string;
  }>;
};

type WorkspaceControllerOptions = {
  editor: EditorView;
  createEditorState: (content: string, fileName: string) => EditorState;
  addDiagnostic: (level: DiagnosticLevel, message: string) => void;
  onStateChange: () => void;
};

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function readResultToOpenFile(result: ReadFileResult): OpenFile {
  return {
    id: result.id,
    path: pathToDisplay(result.path),
    name: result.name,
    handle: result.handle,
    savedContent: result.content,
    content: result.content,
    dirty: false,
    lastModified: result.version.lastModified,
    size: result.version.size,
    pathSegments: [...result.path],
  };
}

export class WorkspaceController {
  private readonly editor: EditorView;
  private readonly createEditorState: WorkspaceControllerOptions["createEditorState"];
  private readonly addDiagnostic: WorkspaceControllerOptions["addDiagnostic"];
  private readonly onStateChange: WorkspaceControllerOptions["onStateChange"];

  private readonly database = new WorkspaceDatabase();
  private readonly repository = new FileSystemWorkspace({
    handleStore: new WorkspaceHandleStore(this.database),
  });
  private readonly sessions: TabSessionStore;
  private readonly drafts: DraftStore;

  private readonly folderButton =
    requiredElement<HTMLButtonElement>("#folder-button");
  private readonly forgetFolderButton =
    requiredElement<HTMLButtonElement>("#forget-folder");
  private readonly workspaceNotice =
    requiredElement<HTMLDivElement>("#workspace-notice");
  private readonly workspaceEditor =
    requiredElement<HTMLDivElement>("#workspace-editor");
  private readonly fileBrowser =
    requiredElement<HTMLElement>("#file-browser");
  private readonly fileTree =
    requiredElement<HTMLDivElement>("#file-tree");
  private readonly rootName =
    requiredElement<HTMLParagraphElement>("#workspace-root-name");
  private readonly refreshButton =
    requiredElement<HTMLButtonElement>("#refresh-tree");
  private readonly disconnectButton =
    requiredElement<HTMLButtonElement>("#disconnect-folder");
  private readonly tabBar =
    requiredElement<HTMLDivElement>("#tab-bar");
  private readonly editorEmpty =
    requiredElement<HTMLDivElement>("#editor-empty");
  private readonly editorStage =
    requiredElement<HTMLDivElement>("#editor-panel-content");
  private readonly editorHost =
    requiredElement<HTMLDivElement>("#editor");
  private readonly activeFileName =
    requiredElement<HTMLParagraphElement>("#active-file-name");
  private readonly saveButton =
    requiredElement<HTMLButtonElement>("#save-file");
  private readonly sourceHeading =
    requiredElement<HTMLHeadingElement>("#source-heading");
  private readonly renderHint =
    requiredElement<HTMLParagraphElement>("#render-hint");
  private readonly conflictDialog =
    requiredElement<HTMLDialogElement>("#save-conflict-dialog");
  private readonly conflictMessage =
    requiredElement<HTMLParagraphElement>("#save-conflict-message");
  private readonly draftRecoveryDialog =
    requiredElement<HTMLDialogElement>("#draft-recovery-dialog");
  private readonly draftRecoveryMessage =
    requiredElement<HTMLParagraphElement>("#draft-recovery-message");

  private mode: "scratchpad" | "folder" = "scratchpad";
  private state: WorkspaceState = createWorkspaceState();
  private descriptor: WorkspaceDescriptor | null = null;
  private scratchpadState: EditorState;
  private displayedFileId: string | null = null;
  private readonly editorStates = new Map<string, EditorState>();
  private readonly directoryCache = new Map<string, DirectorySnapshot>();
  private expandedDirectories = new Set<string>();
  private readonly draftTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  private readonly openingFiles = new Set<string>();
  private readonly savingFiles = new Set<string>();
  private folderActionInFlight: number | null = null;
  private folderActionSequence = 0;
  private saveErrorFileId: string | null = null;
  private savedIndicatorFileId: string | null = null;
  private savedIndicatorTimer: ReturnType<typeof setTimeout> | null = null;
  private dialogQueue: Promise<void> = Promise.resolve();
  private workspaceGeneration = 0;
  private restoringSession = false;
  private disposed = false;

  constructor(options: WorkspaceControllerOptions) {
    this.editor = options.editor;
    this.createEditorState = options.createEditorState;
    this.addDiagnostic = options.addDiagnostic;
    this.onStateChange = options.onStateChange;
    this.scratchpadState = this.editor.state;

    const stateDatabase = this.database as unknown as StateDatabase;
    this.sessions = createTabSessionStore(stateDatabase);
    this.drafts = createDraftStore(stateDatabase);

    this.folderButton.addEventListener("click", this.handleFolderAction);
    this.forgetFolderButton.addEventListener(
      "click",
      this.handleForgetRemembered,
    );
    this.refreshButton.addEventListener("click", this.handleRefresh);
    this.disconnectButton.addEventListener(
      "click",
      this.handleDisconnect,
    );
    this.saveButton.addEventListener("click", this.handleSave);
    window.addEventListener("keydown", this.handleWindowKeydown);
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
  }

  async initialize() {
    const support = this.repository.support;
    if (!support.supported) {
      this.setActionButton(
        this.folderButton,
        "Folder access unavailable",
        "error",
        true,
      );
      this.showNotice(support.message, "warning");
      this.addDiagnostic("warning", support.message);
      return;
    }

    this.setFolderAction(
      "open",
      "Checking saved folder…",
      "loading",
    );
    const restored = await this.repository.restoreRemembered();
    switch (restored.status) {
      case "none":
        this.setFolderAction("open", "Open folder");
        return;
      case "connected":
        await this.enterWorkspace(restored.workspace);
        return;
      case "permission-required":
        this.setFolderAction("reconnect", "Reconnect folder");
        this.forgetFolderButton.hidden = false;
        this.showNotice(
          `Reconnect ${restored.workspace.name} to restore its files.`,
          "warning",
        );
        return;
      case "permission-denied":
        this.setFolderAction("open", "Open folder", "error");
        this.forgetFolderButton.hidden = false;
        this.showNotice(
          `Access to ${restored.workspace.name} was denied. Open a folder to continue.`,
          "error",
        );
        return;
      case "unavailable":
        this.setFolderAction("open", "Open folder");
        this.forgetFolderButton.hidden = false;
        this.showNotice(
          "This browser cannot restore folder access. Open the folder again.",
          "warning",
        );
        return;
      case "invalid":
        this.setFolderAction("open", "Open folder", "error");
        this.showNotice(restored.error.message, "error");
        this.addDiagnostic("error", restored.error.message);
    }
  }

  handleEditorUpdate(update: ViewUpdate) {
    if (
      this.mode !== "folder" ||
      !update.docChanged ||
      !this.state.activeFileId
    ) {
      return;
    }

    const fileId = this.state.activeFileId;
    if (this.saveErrorFileId === fileId) {
      this.saveErrorFileId = null;
    }
    this.editorStates.set(fileId, update.state);
    this.state = editFile(
      this.state,
      fileId,
      update.state.doc.toString(),
    );
    this.scheduleDraft(fileId);
    this.renderTabs();
    this.syncHeader();
    this.onStateChange();
  }

  saveActiveFile(): boolean {
    const file = getActiveFile(this.state);
    if (this.mode !== "folder" || !file) {
      return false;
    }
    if (this.savingFiles.size > 0) {
      return true;
    }
    void this.saveActiveFileNow();
    return true;
  }

  closeActiveFile(): boolean {
    if (this.mode !== "folder" || !this.state.activeFileId) {
      return false;
    }
    void this.closeFileById(this.state.activeFileId);
    return true;
  }

  canRenderActiveFile() {
    if (this.mode === "scratchpad") {
      return true;
    }
    const file = getActiveFile(this.state);
    return file !== null && file.name.toLocaleLowerCase("en-US").endsWith(".ly");
  }

  getRenderContext(): WorkspaceRenderContext | null {
    if (this.mode !== "folder" || !this.descriptor) {
      return null;
    }
    const file = getActiveFile(this.state);
    if (!file || !this.canRenderActiveFile()) {
      return null;
    }
    return {
      source: file.content,
      path: [...file.pathSegments],
      displayPath: file.path,
      rootHandle: this.descriptor.handle,
      openBuffers: this.state.files.map((openFile) => ({
        path: [...openFile.pathSegments],
        content: openFile.content,
      })),
    };
  }

  hasUnsavedChanges() {
    return hasDirtyFiles(this.state);
  }

  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.workspaceGeneration += 1;
    this.folderActionSequence += 1;
    this.folderActionInFlight = null;
    this.folderButton.removeEventListener("click", this.handleFolderAction);
    this.forgetFolderButton.removeEventListener(
      "click",
      this.handleForgetRemembered,
    );
    this.refreshButton.removeEventListener("click", this.handleRefresh);
    this.disconnectButton.removeEventListener(
      "click",
      this.handleDisconnect,
    );
    this.saveButton.removeEventListener("click", this.handleSave);
    window.removeEventListener("keydown", this.handleWindowKeydown);
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
    for (const timer of this.draftTimers.values()) {
      clearTimeout(timer);
    }
    if (this.savedIndicatorTimer) {
      clearTimeout(this.savedIndicatorTimer);
    }
    const pendingDrafts = this.state.workspaceId
      ? this.state.files
        .filter((file) => file.dirty)
        .map((file) =>
          this.drafts.save(this.state.workspaceId!, file)
            .catch(() => undefined)
        )
      : [];
    void Promise.allSettled(pendingDrafts).finally(() => {
      this.database.close();
    });
  }

  private readonly handleFolderAction = () => {
    if (this.folderButton.dataset.action === "reconnect") {
      void this.reconnectFolder();
      return;
    }
    void this.openFolder();
  };

  private readonly handleRefresh = () => {
    void this.refreshTree();
  };

  private readonly handleForgetRemembered = () => {
    void this.forgetRememberedFolder();
  };

  private readonly handleDisconnect = () => {
    void this.disconnectFolder();
  };

  private readonly handleSave = () => {
    void this.saveActiveFileNow();
  };

  private readonly handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      this.flushDrafts();
    }
  };

  private readonly handleWindowKeydown = (event: KeyboardEvent) => {
    if (
      this.mode !== "folder" ||
      this.conflictDialog.open ||
      this.draftRecoveryDialog.open ||
      event.defaultPrevented ||
      !(event.metaKey || event.ctrlKey) ||
      event.altKey
    ) {
      return;
    }

    const key = event.key.toLocaleLowerCase("en-US");
    if (key === "s" && getActiveFile(this.state)) {
      event.preventDefault();
      void this.saveActiveFileNow();
    } else if (key === "w" && this.state.activeFileId) {
      event.preventDefault();
      void this.closeFileById(this.state.activeFileId);
    }
  };

  private async openFolder() {
    if (this.folderActionInFlight !== null) {
      return;
    }
    const discardingDirtyChanges = hasDirtyFiles(this.state);
    if (!this.confirmDiscardAll("open another folder")) {
      return;
    }

    const actionToken = this.beginFolderAction();
    if (actionToken === null) {
      return;
    }
    this.setFolderAction(
      "open",
      this.mode === "folder" ? "Switching…" : "Opening…",
      "loading",
    );
    const oldWorkspaceId =
      this.state.workspaceId ??
      this.repository.getWorkspace()?.workspaceId ??
      null;
    try {
      const workspace = await this.repository.connect();
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      this.cancelDraftTimers();
      if (oldWorkspaceId && oldWorkspaceId !== workspace.workspaceId) {
        await this.clearWorkspaceData(oldWorkspaceId);
        if (!this.isFolderActionCurrent(actionToken)) {
          return;
        }
        this.clearExpandedStorage(oldWorkspaceId);
      } else if (oldWorkspaceId && discardingDirtyChanges) {
        try {
          await this.database.deleteByWorkspaceId(
            "editor-drafts",
            oldWorkspaceId,
          );
          if (!this.isFolderActionCurrent(actionToken)) {
            return;
          }
        } catch (error) {
          if (this.isFolderActionCurrent(actionToken)) {
            this.reportStorageWarning(error);
          }
        }
      }
      await this.enterWorkspace(workspace);
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      this.reportPersistenceWarning();
    } catch (error) {
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      if (isWorkspaceError(error, "picker-cancelled")) {
        return;
      }
      this.reportError(error);
      if (this.folderButton.dataset.state === "loading") {
        this.setFolderAction(
          "open",
          this.mode === "folder" ? "Try switching again" : "Try opening again",
          "error",
        );
      }
    } finally {
      if (
        this.isFolderActionCurrent(actionToken) &&
        this.folderButton.dataset.state === "loading"
      ) {
        this.setFolderAction(
          "open",
          this.mode === "folder" ? "Switch folder" : "Open folder",
        );
      }
      this.finishFolderAction(actionToken);
    }
  }

  private async reconnectFolder() {
    const actionToken = this.beginFolderAction();
    if (actionToken === null) {
      return;
    }
    this.setFolderAction("reconnect", "Reconnecting…", "loading");
    try {
      const workspace = await this.repository.reconnect();
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      if (
        this.mode === "folder" &&
        this.state.workspaceId === workspace.workspaceId
      ) {
        this.descriptor = workspace;
        this.setFolderAction("open", "Switch folder");
        this.showNotice("", "info");
        this.addDiagnostic(
          "info",
          `Reconnected ${workspace.name} with local read and write access`,
        );
      } else {
        await this.enterWorkspace(workspace);
        if (!this.isFolderActionCurrent(actionToken)) {
          return;
        }
      }
      this.reportPersistenceWarning();
    } catch (error) {
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      this.reportError(error);
      if (this.folderButton.dataset.state === "loading") {
        this.setFolderAction(
          "reconnect",
          "Try reconnecting",
          "error",
        );
      }
    } finally {
      if (
        this.isFolderActionCurrent(actionToken) &&
        this.folderButton.dataset.state === "loading"
      ) {
        this.setFolderAction("reconnect", "Reconnect folder");
      }
      this.finishFolderAction(actionToken);
    }
  }

  private async forgetRememberedFolder() {
    if (this.mode === "folder") {
      await this.disconnectFolder();
      return;
    }

    const actionToken = this.beginFolderAction();
    if (actionToken === null) {
      return;
    }
    const workspace = this.repository.getWorkspace();
    this.setActionButton(
      this.forgetFolderButton,
      "Forgetting…",
      "loading",
      true,
    );
    try {
      await this.repository.disconnect();
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      const persistenceWarning =
        this.repository.takePersistenceWarning();
      if (workspace) {
        await this.clearWorkspaceData(workspace.workspaceId);
        if (!this.isFolderActionCurrent(actionToken)) {
          return;
        }
        this.clearExpandedStorage(workspace.workspaceId);
      }
      this.forgetFolderButton.hidden = true;
      this.setFolderAction("open", "Open folder");
      if (persistenceWarning) {
        this.showNotice(
          "Closed the folder, but the browser could not forget its saved handle.",
          "warning",
        );
        this.addDiagnostic("warning", persistenceWarning.message);
      } else {
        this.showNotice("", "info");
        this.addDiagnostic("info", "Forgot the saved folder");
      }
    } catch (error) {
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      this.reportError(error);
      this.setActionButton(
        this.forgetFolderButton,
        "Try forgetting again",
        "error",
      );
    } finally {
      if (
        this.isFolderActionCurrent(actionToken) &&
        this.forgetFolderButton.dataset.state === "loading"
      ) {
        this.setActionButton(
          this.forgetFolderButton,
          "Forget saved folder",
        );
      }
      this.finishFolderAction(actionToken);
    }
  }

  private async disconnectFolder() {
    if (this.folderActionInFlight !== null) {
      return;
    }
    if (!this.confirmDiscardAll("disconnect this folder")) {
      return;
    }
    const actionToken = this.beginFolderAction();
    if (actionToken === null) {
      return;
    }
    this.setActionButton(
      this.disconnectButton,
      "Disconnecting…",
      "loading",
      true,
    );
    const workspaceId = this.state.workspaceId;
    try {
      await this.repository.disconnect();
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      if (workspaceId) {
        await this.clearWorkspaceData(workspaceId);
        if (!this.isFolderActionCurrent(actionToken)) {
          return;
        }
        this.clearExpandedStorage(workspaceId);
      }
      const persistenceWarning =
        this.repository.takePersistenceWarning();
      this.leaveWorkspace();
      if (persistenceWarning) {
        this.showNotice(
          "Disconnected, but the browser could not forget the saved handle.",
          "warning",
        );
        this.addDiagnostic("warning", persistenceWarning.message);
      } else {
        this.showNotice("", "info");
        this.addDiagnostic("info", "Disconnected the local folder");
      }
    } catch (error) {
      if (!this.isFolderActionCurrent(actionToken)) {
        return;
      }
      this.reportError(error);
      this.setActionButton(
        this.disconnectButton,
        "Try disconnecting again",
        "error",
      );
    } finally {
      this.finishFolderAction(actionToken);
    }
  }

  private async enterWorkspace(workspace: WorkspaceDescriptor) {
    const generation = ++this.workspaceGeneration;
    if (this.mode === "scratchpad") {
      this.scratchpadState = this.editor.state;
    }

    this.mode = "folder";
    this.descriptor = workspace;
    this.restoringSession = true;
    this.fileBrowser.setAttribute("aria-busy", "true");
    this.state = createWorkspaceState(workspace.workspaceId);
    this.displayedFileId = null;
    this.saveErrorFileId = null;
    this.editorStates.clear();
    this.directoryCache.clear();
    this.expandedDirectories = this.loadExpandedDirectories(
      workspace.workspaceId,
    );

    this.workspaceEditor.dataset.mode = "folder";
    this.fileBrowser.hidden = false;
    this.tabBar.hidden = false;
    this.saveButton.hidden = false;
    this.rootName.textContent = workspace.name;
    this.rootName.title = workspace.name;
    this.forgetFolderButton.hidden = true;
    this.setFolderAction("open", "Loading folder…", "loading");
    this.showNotice("", "info");
    this.renderInterface();

    try {
      await Promise.all([
        this.refreshTree(generation),
        this.restoreTabSession(workspace.workspaceId, generation),
      ]);
    } finally {
      if (generation === this.workspaceGeneration) {
        this.restoringSession = false;
        this.fileBrowser.removeAttribute("aria-busy");
        this.renderInterface();
        this.activateCurrentEditor(false);
        this.setFolderAction("open", "Switch folder");
        this.addDiagnostic(
          "info",
          `Opened ${workspace.name} with local read and write access`,
        );
        this.onStateChange();
      }
    }
  }

  private leaveWorkspace() {
    this.workspaceGeneration += 1;
    this.restoringSession = false;
    this.fileBrowser.removeAttribute("aria-busy");
    this.cancelDraftTimers();
    this.mode = "scratchpad";
    this.descriptor = null;
    this.state = createWorkspaceState();
    this.displayedFileId = null;
    this.saveErrorFileId = null;
    this.editorStates.clear();
    this.savingFiles.clear();
    this.directoryCache.clear();
    this.expandedDirectories.clear();
    this.workspaceEditor.dataset.mode = "scratchpad";
    this.fileBrowser.hidden = true;
    this.tabBar.hidden = true;
    this.saveButton.hidden = true;
    this.rootName.textContent = "";
    this.rootName.removeAttribute("title");
    this.forgetFolderButton.hidden = true;
    this.setFolderAction("open", "Open folder");
    this.setActionButton(
      this.refreshButton,
      "Refresh files",
    );
    this.setActionButton(
      this.disconnectButton,
      "Disconnect folder",
    );
    this.editorEmpty.hidden = true;
    this.editorHost.inert = false;
    this.editorHost.removeAttribute("aria-hidden");
    this.activeFileName.textContent = "main.ly";
    this.sourceHeading.textContent = "LilyPond source";
    this.renderHint.innerHTML =
      "Render with <kbd>⌘</kbd> or <kbd>Ctrl</kbd> + <kbd>Enter</kbd>";
    this.editor.setState(this.scratchpadState);
    this.onStateChange();
  }

  private async restoreTabSession(
    workspaceId: string,
    generation: number,
  ) {
    let metadata;
    try {
      metadata = await this.sessions.load(workspaceId);
    } catch (error) {
      this.reportStorageWarning(error);
      return;
    }
    if (!metadata) {
      return;
    }

    const resolvedFiles: OpenFile[] = [];
    for (const savedFile of metadata.openFiles) {
      try {
        const result = await this.repository.readTextFile(
          savedFile.pathSegments,
        );
        if (generation !== this.workspaceGeneration) {
          return;
        }
        let file = readResultToOpenFile(result);
        try {
          const draft = await this.drafts.load(workspaceId, file.path);
          if (generation !== this.workspaceGeneration) {
            return;
          }
          if (draft && draftDiffersFromDisk(draft, file.savedContent)) {
            const choice = await this.askDraftChoice(file.path);
            if (choice === "restore") {
              file = {
                ...file,
                content: draft.content,
                dirty: draft.content !== file.savedContent,
              };
              this.addDiagnostic(
                "info",
                `Restored unsaved work for ${file.path}`,
              );
            } else {
              await this.drafts.discard(workspaceId, file.path);
              this.addDiagnostic(
                "info",
                `Discarded the recovery draft for ${file.path}`,
              );
            }
          } else if (draft) {
            await this.drafts.discard(workspaceId, file.path);
          }
        } catch (error) {
          this.reportStorageWarning(error);
        }
        resolvedFiles.push(file);
      } catch (error) {
        this.addDiagnostic(
          "warning",
          `Could not restore ${savedFile.path}: ${errorMessage(error)}`,
        );
      }
    }

    if (generation !== this.workspaceGeneration) {
      return;
    }
    this.state = restoreSessionMetadata(metadata, resolvedFiles);
    for (const file of this.state.files) {
      this.editorStates.set(
        file.id,
        this.createEditorState(file.content, file.name),
      );
    }
    this.persistSession();
  }

  private async openFile(entry: Extract<WorkspaceEntry, { kind: "file" }>) {
    if (!entry.fileType.editable) {
      const message = `${pathToDisplay(entry.path)} is not a supported text file.`;
      this.showNotice(message, "warning");
      this.addDiagnostic("warning", message);
      return;
    }

    const existing = this.state.files.find((file) => file.id === entry.id);
    if (existing) {
      this.state = focusFile(this.state, existing.id);
      this.activateCurrentEditor(true);
      this.persistSession();
      return;
    }

    const generation = this.workspaceGeneration;
    const openKey = `${generation}\0${entry.id}`;
    if (this.openingFiles.has(openKey)) {
      return;
    }
    this.openingFiles.add(openKey);
    this.renderTree();
    const workspaceId = this.state.workspaceId;
    try {
      const result = await this.repository.readTextFile(entry.path);
      if (
        generation !== this.workspaceGeneration ||
        workspaceId !== this.state.workspaceId
      ) {
        return;
      }
      let file = readResultToOpenFile(result);
      if (this.state.workspaceId) {
        try {
          const draft = await this.drafts.load(
            this.state.workspaceId,
            file.path,
          );
          if (generation !== this.workspaceGeneration) {
            return;
          }
          if (draft && draftDiffersFromDisk(draft, file.savedContent)) {
            const choice = await this.askDraftChoice(file.path);
            if (choice === "restore") {
              file = {
                ...file,
                content: draft.content,
                dirty: draft.content !== file.savedContent,
              };
              this.addDiagnostic(
                "info",
                `Restored unsaved work for ${file.path}`,
              );
            } else {
              await this.drafts.discard(this.state.workspaceId, file.path);
              this.addDiagnostic(
                "info",
                `Discarded the recovery draft for ${file.path}`,
              );
            }
          } else if (draft) {
            await this.drafts.discard(this.state.workspaceId, file.path);
          }
        } catch (error) {
          this.reportStorageWarning(error);
        }
      }

      if (generation !== this.workspaceGeneration) {
        return;
      }
      const alreadyOpen = this.state.files.find(
        (candidate) => candidate.id === file.id,
      );
      if (alreadyOpen) {
        this.state = focusFile(this.state, alreadyOpen.id);
        this.activateCurrentEditor(true);
        this.persistSession();
        return;
      }
      this.state = openOrFocusFile(this.state, file);
      this.editorStates.set(
        file.id,
        this.createEditorState(file.content, file.name),
      );
      this.activateCurrentEditor(true);
      this.persistSession();
      this.addDiagnostic("info", `Opened ${file.path}`);
    } catch (error) {
      this.reportError(error);
    } finally {
      this.openingFiles.delete(openKey);
      this.renderTree();
    }
  }

  private async closeFileById(fileId: string) {
    if (this.savingFiles.has(this.saveKey(fileId))) {
      this.showNotice(
        "Wait for the current save before closing this file.",
        "warning",
      );
      return;
    }
    const generation = this.workspaceGeneration;
    let result = closeFile(this.state, fileId);
    if (!result.closed && result.reason === "dirty") {
      const discard = window.confirm(
        `${result.file?.path ?? "This file"} has unsaved changes. ` +
          "Close it and discard those changes?",
      );
      if (!discard) {
        return;
      }
      result = closeFile(this.state, fileId, { discardChanges: true });
    }
    if (!result.closed) {
      return;
    }

    this.state = result.state;
    if (this.saveErrorFileId === fileId) {
      this.saveErrorFileId = null;
    }
    this.editorStates.delete(fileId);
    if (this.displayedFileId === fileId) {
      this.displayedFileId = null;
    }
    this.clearDraftTimer(fileId);
    const workspaceId = this.state.workspaceId;
    this.activateCurrentEditor(true);
    this.persistSession();

    if (workspaceId) {
      try {
        await this.drafts.discard(
          workspaceId,
          result.file.path,
        );
      } catch (error) {
        if (generation === this.workspaceGeneration) {
          this.reportStorageWarning(error);
        }
      }
    }
  }

  private async saveActiveFileNow() {
    const file = getActiveFile(this.state);
    if (this.mode !== "folder" || !file || !this.state.workspaceId) {
      return;
    }

    const saveKey = this.saveKey(file.id);
    if (this.savingFiles.size > 0) {
      this.showNotice(
        "Wait for the current save before saving another file.",
        "warning",
      );
      return;
    }
    this.savingFiles.add(saveKey);
    this.saveErrorFileId = null;
    const contentToSave = file.content;
    const generation = this.workspaceGeneration;
    const workspaceId = this.state.workspaceId;
    this.syncHeader();
    try {
      let result = await this.repository.writeFileHandle(
        file.pathSegments,
        file.handle,
        contentToSave,
        {
          lastModified: file.lastModified,
          size: file.size,
          content: file.savedContent,
        },
      );
      if (
        generation !== this.workspaceGeneration ||
        workspaceId !== this.state.workspaceId
      ) {
        return;
      }

      if (result.status === "conflict") {
        const choice = await this.askConflictChoice(file.path);
        if (generation !== this.workspaceGeneration) {
          return;
        }
        if (choice === "cancel") {
          this.renderInterface();
          return;
        }
        if (choice === "reload") {
          this.saveErrorFileId = null;
          this.state = reloadFile(this.state, file.id, {
            content: result.actual.content,
            lastModified: result.actual.version.lastModified,
            size: result.actual.version.size,
          });
          const reloaded = this.state.files.find(
            (candidate) => candidate.id === file.id,
          );
          if (reloaded) {
            const nextState = this.createEditorState(
              reloaded.content,
              reloaded.name,
            );
            this.editorStates.set(file.id, nextState);
            if (this.state.activeFileId === file.id) {
              this.editor.setState(nextState);
              this.displayedFileId = file.id;
            }
          }
          let draftDiscardError: unknown = null;
          try {
            await this.drafts.discard(this.state.workspaceId, file.path);
          } catch (error) {
            draftDiscardError = error;
            this.addDiagnostic(
              "warning",
              `Reloaded ${file.path}, but the recovery draft could not be removed. ` +
                errorMessage(error),
            );
          }
          this.renderInterface();
          this.persistSession();
          if (draftDiscardError) {
            this.showNotice(
              `Reloaded ${file.path}, but the recovery draft could not be removed.`,
              "warning",
            );
          } else {
            this.clearErrorNotice();
          }
          this.addDiagnostic("info", `Reloaded ${file.path} from disk`);
          return;
        }
        result = await this.repository.writeFileHandle(
          file.pathSegments,
          file.handle,
          contentToSave,
          undefined,
          { force: true, requestPermission: false },
        );
        if (generation !== this.workspaceGeneration) {
          return;
        }
      }

      this.state = applySaveResult(this.state, file.id, {
        ok: true,
        content: contentToSave,
        lastModified: result.version.lastModified,
        size: result.version.size,
      });
      this.saveErrorFileId = null;
      const current = this.state.files.find(
        (candidate) => candidate.id === file.id,
      );
      let draftStorageError: unknown = null;
      if (current) {
        try {
          await this.drafts.save(this.state.workspaceId, current);
        } catch (error) {
          draftStorageError = error;
          this.addDiagnostic(
            "warning",
            `Saved ${file.path}, but the recovery draft could not be updated. ` +
              errorMessage(error),
          );
        }
      }
      this.persistSession();
      if (current?.dirty) {
        this.showNotice(
          draftStorageError
            ? `Saved ${file.path}; newer edits remain unsaved and the recovery draft could not be updated.`
            : `Saved ${file.path}; newer editor changes remain unsaved.`,
          "warning",
        );
        this.addDiagnostic(
          "warning",
          `Saved ${file.path}; newer editor changes remain unsaved`,
        );
      } else {
        this.showSavedIndicator(file.id);
        if (draftStorageError) {
          this.showNotice(
            `Saved ${file.path}, but the recovery draft could not be updated.`,
            "warning",
          );
        } else {
          this.clearErrorNotice();
        }
        this.addDiagnostic("success", `Saved ${file.path}`);
      }
      void this.refreshTree();
    } catch (error) {
      if (
        generation === this.workspaceGeneration &&
        workspaceId === this.state.workspaceId
      ) {
        this.saveErrorFileId = file.id;
      }
      if (
        isWorkspaceError(error, "permission-required") ||
        isWorkspaceError(error, "permission-denied")
      ) {
        this.setFolderAction("reconnect", "Reconnect folder");
      }
      this.reportError(error);
    } finally {
      this.savingFiles.delete(saveKey);
      this.renderInterface();
    }
  }

  private askConflictChoice(path: string): Promise<ConflictChoice> {
    return this.queueDialog(() => {
      this.conflictMessage.textContent =
        `${path} changed on disk after this editor opened it.`;
      this.conflictDialog.returnValue = "cancel";
      this.conflictDialog.showModal();
      return new Promise<ConflictChoice>((resolve) => {
        this.conflictDialog.addEventListener(
          "close",
          () => {
            const value = this.conflictDialog.returnValue;
            resolve(
              value === "reload" || value === "overwrite"
                ? value
                : "cancel",
            );
          },
          { once: true },
        );
      });
    });
  }

  private askDraftChoice(path: string): Promise<DraftChoice> {
    return this.queueDialog(() => {
      this.draftRecoveryMessage.textContent =
        `${path} has a recovery draft from an earlier editing session.`;
      this.draftRecoveryDialog.returnValue = "restore";
      this.draftRecoveryDialog.showModal();
      return new Promise<DraftChoice>((resolve) => {
        this.draftRecoveryDialog.addEventListener(
          "close",
          () => {
            resolve(
              this.draftRecoveryDialog.returnValue === "discard"
                ? "discard"
                : "restore",
            );
          },
          { once: true },
        );
      });
    });
  }

  private queueDialog<T>(openDialog: () => Promise<T>): Promise<T> {
    const result = this.dialogQueue.then(openDialog);
    this.dialogQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private activateCurrentEditor(focusEditor: boolean) {
    const activeFile = getActiveFile(this.state);
    if (!activeFile) {
      this.displayedFileId = null;
      this.renderInterface();
      return;
    }

    if (
      this.displayedFileId &&
      this.displayedFileId !== activeFile.id
    ) {
      this.editorStates.set(this.displayedFileId, this.editor.state);
    }

    const nextState =
      this.editorStates.get(activeFile.id) ??
      this.createEditorState(activeFile.content, activeFile.name);
    this.editorStates.set(activeFile.id, nextState);
    if (this.displayedFileId !== activeFile.id) {
      this.editor.setState(nextState);
      this.displayedFileId = activeFile.id;
    }
    this.renderInterface();
    if (focusEditor) {
      this.editor.focus();
    }
  }

  private renderInterface() {
    this.renderTabs();
    this.renderTree();
    this.syncHeader();
    this.onStateChange();
  }

  private renderTabs() {
    if (this.mode !== "folder") {
      return;
    }
    this.tabBar.replaceChildren();
    this.editorStage.removeAttribute("aria-labelledby");
    for (const [index, file] of this.state.files.entries()) {
      const active = file.id === this.state.activeFileId;
      const tab = document.createElement("div");
      tab.className = "editor-tab";
      tab.dataset.active = String(active);

      const select = document.createElement("button");
      select.className = "editor-tab__select";
      select.type = "button";
      select.id = `workspace-tab-${index}`;
      select.role = "tab";
      select.dataset.fileId = file.id;
      select.title = file.path;
      select.setAttribute(
        "aria-label",
        file.dirty ? `${file.path}, unsaved changes` : file.path,
      );
      select.setAttribute("aria-selected", String(active));
      select.setAttribute("aria-controls", this.editorStage.id);
      select.tabIndex = active ? 0 : -1;
      if (active) {
        this.editorStage.setAttribute("aria-labelledby", select.id);
      }
      select.addEventListener("click", () => {
        this.state = focusFile(this.state, file.id);
        this.activateCurrentEditor(false);
        this.persistSession();
      });
      select.addEventListener("keydown", (event) => {
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) {
          return;
        }
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowLeft") {
          nextIndex =
            (index - 1 + this.state.files.length) %
            this.state.files.length;
        } else if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % this.state.files.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = this.state.files.length - 1;
        }
        const nextFile = this.state.files[nextIndex];
        if (!nextFile) {
          return;
        }
        this.state = focusFile(this.state, nextFile.id);
        this.activateCurrentEditor(false);
        this.persistSession();
        const nextTab = [...this.tabBar.querySelectorAll<HTMLElement>(
          '[role="tab"]',
        )].find((candidate) =>
          candidate.dataset.fileId === nextFile.id
        );
        nextTab?.focus();
      });

      const name = document.createElement("span");
      name.textContent = file.name;
      select.append(name);
      if (file.dirty) {
        const dirty = document.createElement("span");
        dirty.className = "editor-tab__dirty";
        dirty.textContent = " •";
        dirty.setAttribute("aria-label", "Unsaved changes");
        select.append(dirty);
      }

      const close = document.createElement("button");
      close.className = "editor-tab__close";
      close.type = "button";
      close.textContent = "×";
      close.setAttribute("aria-label", `Close ${file.path}`);
      close.title = `Close ${file.path}`;
      close.addEventListener("click", () => {
        void this.closeFileById(file.id);
      });
      tab.append(select, close);
      this.tabBar.append(tab);
    }
  }

  private syncHeader() {
    if (this.mode !== "folder") {
      return;
    }
    const file = getActiveFile(this.state);
    this.editorEmpty.hidden = file !== null;
    this.editorHost.inert = file === null;
    if (file) {
      this.editorHost.removeAttribute("aria-hidden");
    } else {
      this.editorHost.setAttribute("aria-hidden", "true");
    }
    this.activeFileName.textContent = file?.path ?? "No file open";
    const saving = this.savingFiles.size > 0;
    const saved =
      file !== null && this.savedIndicatorFileId === file.id;
    const saveFailed =
      file !== null && this.saveErrorFileId === file.id;
    const saveState: ActionState = saving
      ? "loading"
      : saved
        ? "success"
        : saveFailed
          ? "error"
          : "idle";
    this.setActionButton(
      this.saveButton,
      saving
        ? "Saving…"
        : saved
          ? "Saved"
          : saveFailed
            ? "Retry save"
            : "Save file",
      saveState,
      !file || !file.dirty || saving,
    );
    this.saveButton.title = !file
      ? "Open a file before saving"
      : saveFailed
        ? "The last save failed. Try writing this file again."
        : "Save this file to disk with Command or Ctrl + S";

    if (!file) {
      this.sourceHeading.textContent = "Workspace files";
      this.renderHint.textContent = "Choose a .ly file to render";
    } else if (isLilyPondFile(file.name)) {
      this.sourceHeading.textContent = "LilyPond source";
      this.renderHint.textContent =
        file.name.toLocaleLowerCase("en-US").endsWith(".ly")
        ? "Render current edits · Save writes to disk"
        : "Save writes to disk · Included files are not rendered alone";
    } else {
      this.sourceHeading.textContent = "Text source";
      this.renderHint.textContent =
        "Save writes to disk · Only .ly files can be rendered";
    }
  }

  private async refreshTree(
    generation = this.workspaceGeneration,
  ) {
    if (
      this.mode !== "folder" ||
      generation !== this.workspaceGeneration
    ) {
      return;
    }
    this.setActionButton(
      this.refreshButton,
      "Refreshing…",
      "loading",
      true,
    );
    this.directoryCache.clear();
    try {
      await this.loadDirectory([], generation);
      if (generation !== this.workspaceGeneration) {
        return;
      }
      const expandedPaths = [...this.expandedDirectories]
        .map((id) => {
          try {
            return pathFromId(id);
          } catch {
            return null;
          }
        })
        .filter((path): path is string[] => path !== null)
        .sort((left, right) => left.length - right.length);
      for (const path of expandedPaths) {
        await this.loadDirectory(path, generation);
        if (generation !== this.workspaceGeneration) {
          return;
        }
      }
    } finally {
      if (generation !== this.workspaceGeneration) {
        return;
      }
      const root = this.directoryCache.get(pathToId([]));
      if (root?.status === "error") {
        this.setActionButton(
          this.refreshButton,
          "Retry refresh",
          "error",
        );
      } else {
        this.setActionButton(
          this.refreshButton,
          "Refresh files",
        );
      }
      this.renderTree();
    }
  }

  private async loadDirectory(path: string[], generation: number) {
    if (generation !== this.workspaceGeneration) {
      return;
    }
    const id = pathToId(path);
    this.directoryCache.set(id, { status: "loading", entries: [] });
    this.renderTree();
    try {
      const entries = await this.repository.listDirectory(path);
      if (generation !== this.workspaceGeneration) {
        return;
      }
      this.directoryCache.set(id, { status: "ready", entries });
    } catch (error) {
      if (generation !== this.workspaceGeneration) {
        return;
      }
      const message = errorMessage(error);
      this.directoryCache.set(id, {
        status: "error",
        entries: [],
        message,
      });
      this.addDiagnostic("error", message);
    }
  }

  private renderTree() {
    if (this.mode !== "folder") {
      return;
    }
    this.fileTree.replaceChildren();
    const root = this.directoryCache.get(pathToId([]));
    if (!root || root.status === "loading") {
      this.fileTree.append(this.treeMessage("Loading files…"));
      return;
    }
    if (root.status === "error") {
      this.fileTree.append(
        this.treeMessage(root.message ?? "Could not read the folder.", true),
      );
      return;
    }
    if (root.entries.length === 0) {
      this.fileTree.append(this.treeMessage("This folder is empty."));
      return;
    }
    this.fileTree.append(this.renderTreeGroup(root.entries));
  }

  private renderTreeGroup(entries: WorkspaceEntry[]) {
    const group = document.createElement("ul");
    group.className = "tree-group";

    for (const entry of entries) {
      const item = document.createElement("li");
      const row = document.createElement("div");
      row.className = "tree-row";

      if (entry.kind === "directory") {
        const expanded = this.expandedDirectories.has(entry.id);
        const directory = document.createElement("button");
        directory.className = "tree-file tree-directory";
        directory.type = "button";
        directory.disabled = this.restoringSession;
        directory.title = pathToDisplay(entry.path);
        directory.setAttribute("aria-expanded", String(expanded));

        const marker = document.createElement("span");
        marker.className = "tree-directory__marker";
        marker.textContent = expanded ? "▾" : "▸";
        marker.setAttribute("aria-hidden", "true");

        const name = document.createElement("span");
        name.className = "tree-directory__name";
        name.textContent = `${entry.name}/`;
        directory.append(marker, name);
        const toggleEntry = () => {
          void this.toggleDirectory(entry);
        };
        directory.addEventListener("click", toggleEntry);
        row.append(directory);
        item.append(row);

        if (expanded) {
          const snapshot = this.directoryCache.get(entry.id);
          if (!snapshot || snapshot.status === "loading") {
            item.append(this.treeMessage("Loading…"));
          } else if (snapshot.status === "error") {
            item.append(
              this.treeMessage(
                snapshot.message ?? "Could not read this folder.",
                true,
              ),
            );
          } else if (snapshot.entries.length === 0) {
            item.append(this.treeMessage("Empty folder"));
          } else {
            item.append(this.renderTreeGroup(snapshot.entries));
          }
        }
      } else {
        const opening = this.openingFiles.has(
          `${this.workspaceGeneration}\0${entry.id}`,
        );
        row.dataset.active = String(
          entry.id === this.state.activeFileId,
        );
        const spacer = document.createElement("span");
        spacer.setAttribute("aria-hidden", "true");
        const file = document.createElement("button");
        file.className = "tree-file";
        file.type = "button";
        file.disabled = this.restoringSession || opening;
        file.textContent = opening
          ? `${entry.name} · opening…`
          : entry.name;
        file.title = pathToDisplay(entry.path);
        file.dataset.supported = String(entry.fileType.editable);
        file.dataset.state = opening ? "loading" : "idle";
        if (opening) {
          file.setAttribute("aria-busy", "true");
        }
        file.addEventListener("click", () => {
          void this.openFile(entry);
        });
        row.append(spacer, file);
        item.append(row);
      }
      group.append(item);
    }
    return group;
  }

  private treeMessage(message: string, error = false) {
    const element = document.createElement("p");
    element.className = "tree-message";
    element.textContent = message;
    if (error) {
      element.dataset.state = "error";
    }
    return element;
  }

  private async toggleDirectory(
    entry: Extract<WorkspaceEntry, { kind: "directory" }>,
  ) {
    if (this.expandedDirectories.has(entry.id)) {
      this.expandedDirectories.delete(entry.id);
      this.saveExpandedDirectories();
      this.renderTree();
      return;
    }

    this.expandedDirectories.add(entry.id);
    this.saveExpandedDirectories();
    this.renderTree();
    if (!this.directoryCache.has(entry.id)) {
      await this.loadDirectory(entry.path, this.workspaceGeneration);
    }
    this.renderTree();
  }

  private scheduleDraft(fileId: string) {
    this.clearDraftTimer(fileId);
    const timer = setTimeout(() => {
      this.draftTimers.delete(fileId);
      const file = this.state.files.find(
        (candidate) => candidate.id === fileId,
      );
      if (!file || !this.state.workspaceId) {
        return;
      }
      void this.drafts
        .save(this.state.workspaceId, file)
        .catch((error) => this.reportStorageWarning(error));
    }, 350);
    this.draftTimers.set(fileId, timer);
  }

  private clearDraftTimer(fileId: string) {
    const timer = this.draftTimers.get(fileId);
    if (timer) {
      clearTimeout(timer);
      this.draftTimers.delete(fileId);
    }
  }

  private cancelDraftTimers() {
    for (const timer of this.draftTimers.values()) {
      clearTimeout(timer);
    }
    this.draftTimers.clear();
  }

  private flushDrafts() {
    if (!this.state.workspaceId) {
      return;
    }
    for (const file of this.state.files) {
      this.clearDraftTimer(file.id);
      void this.drafts
        .save(this.state.workspaceId, file)
        .catch((error) => this.reportStorageWarning(error));
    }
  }

  private persistSession() {
    const metadata = serializeSessionMetadata(this.state);
    if (!metadata) {
      return;
    }
    void this.sessions
      .save(metadata)
      .catch((error) => this.reportStorageWarning(error));
  }

  private confirmDiscardAll(action: string) {
    if (this.savingFiles.size > 0) {
      this.showNotice(
        "Wait for the current save before changing folders.",
        "warning",
      );
      return false;
    }
    if (!hasDirtyFiles(this.state)) {
      return true;
    }
    const count = this.state.files.filter((file) => file.dirty).length;
    return window.confirm(
      `${count} open ${count === 1 ? "file has" : "files have"} unsaved ` +
        `changes. Discard them and ${action}?`,
    );
  }

  private async clearWorkspaceData(workspaceId: string) {
    try {
      await Promise.all([
        this.sessions.clear(workspaceId),
        this.database.deleteByWorkspaceId("editor-drafts", workspaceId),
      ]);
    } catch (error) {
      this.reportStorageWarning(error);
    }
  }

  private expandedStorageKey(workspaceId: string) {
    return `lilypond-workspace-expanded:${workspaceId}`;
  }

  private loadExpandedDirectories(workspaceId: string) {
    try {
      const value = localStorage.getItem(
        this.expandedStorageKey(workspaceId),
      );
      if (!value) {
        return new Set<string>();
      }
      const ids = JSON.parse(value);
      if (!Array.isArray(ids)) {
        return new Set<string>();
      }
      return new Set(
        ids.filter((id): id is string => {
          if (typeof id !== "string") {
            return false;
          }
          try {
            return pathFromId(id).length > 0;
          } catch {
            return false;
          }
        }),
      );
    } catch {
      return new Set<string>();
    }
  }

  private saveExpandedDirectories() {
    if (!this.state.workspaceId) {
      return;
    }
    try {
      localStorage.setItem(
        this.expandedStorageKey(this.state.workspaceId),
        JSON.stringify([...this.expandedDirectories]),
      );
    } catch {
      this.addDiagnostic(
        "warning",
        "Could not save the expanded folder state.",
      );
    }
  }

  private clearExpandedStorage(workspaceId: string) {
    try {
      localStorage.removeItem(this.expandedStorageKey(workspaceId));
    } catch {
      // Folder access and editing still work without this preference.
    }
  }

  private setFolderAction(
    action: "open" | "reconnect",
    label: string,
    state: ActionState = "idle",
  ) {
    this.folderButton.dataset.action = action;
    this.setActionButton(
      this.folderButton,
      label,
      state,
      state === "loading",
    );
    this.folderButton.title =
      action === "reconnect"
        ? "Restore read and write access to the saved folder"
        : this.mode === "folder"
          ? "Choose another local folder"
          : "Open a local folder with read and write access";
  }

  private setActionButton(
    button: HTMLButtonElement,
    label: string,
    state: ActionState = "idle",
    disabled = false,
  ) {
    button.textContent = label;
    button.dataset.state = state;
    button.disabled = disabled || (
      this.folderActionInFlight !== null &&
      this.isFolderLifecycleButton(button)
    );
    if (state === "loading") {
      button.setAttribute("aria-busy", "true");
    } else {
      button.removeAttribute("aria-busy");
    }
  }

  private beginFolderAction(): number | null {
    if (this.folderActionInFlight !== null || this.disposed) {
      return null;
    }
    const token = ++this.folderActionSequence;
    this.folderActionInFlight = token;
    this.syncFolderLifecycleButtons();
    return token;
  }

  private isFolderActionCurrent(token: number) {
    return !this.disposed && this.folderActionInFlight === token;
  }

  private finishFolderAction(token: number) {
    if (this.folderActionInFlight !== token) {
      return;
    }
    this.folderActionInFlight = null;
    this.syncFolderLifecycleButtons();
  }

  private syncFolderLifecycleButtons() {
    const disabled = this.folderActionInFlight !== null;
    for (
      const button of [
        this.folderButton,
        this.forgetFolderButton,
        this.disconnectButton,
      ]
    ) {
      button.disabled = disabled || button.dataset.state === "loading";
    }
  }

  private isFolderLifecycleButton(button: HTMLButtonElement) {
    return button === this.folderButton ||
      button === this.forgetFolderButton ||
      button === this.disconnectButton;
  }

  private saveKey(fileId: string) {
    return `${this.state.workspaceId ?? "scratchpad"}\0${fileId}`;
  }

  private showNotice(message: string, state: NoticeState) {
    this.workspaceNotice.hidden = message.length === 0;
    this.workspaceNotice.textContent = message;
    this.workspaceNotice.dataset.state = state;
  }

  private clearErrorNotice() {
    if (this.workspaceNotice.dataset.state === "error") {
      this.showNotice("", "info");
    }
  }

  private showSavedIndicator(fileId: string) {
    this.savedIndicatorFileId = fileId;
    if (this.savedIndicatorTimer) {
      clearTimeout(this.savedIndicatorTimer);
    }
    this.savedIndicatorTimer = setTimeout(() => {
      this.savedIndicatorFileId = null;
      this.savedIndicatorTimer = null;
      this.syncHeader();
    }, 1_800);
  }

  private reportPersistenceWarning() {
    const warning = this.repository.takePersistenceWarning();
    if (!warning) {
      return;
    }
    const message =
      "The folder is open for this tab, but the browser could not remember it.";
    this.showNotice(message, "warning");
    this.addDiagnostic("warning", `${message} ${warning.message}`);
  }

  private reportStorageWarning(error: unknown) {
    const message =
      `The folder stays usable, but its editor session could not be saved. ` +
      errorMessage(error);
    this.showNotice(message, "warning");
    this.addDiagnostic("warning", message);
  }

  private reportError(error: unknown) {
    const message = errorMessage(error);
    this.showNotice(message, "error");
    this.addDiagnostic("error", message);
    if (
      error instanceof WorkspaceError &&
      error.code === "permission-required"
    ) {
      this.setFolderAction("reconnect", "Reconnect folder");
      this.forgetFolderButton.hidden =
        this.mode === "folder" ||
        this.repository.getWorkspace() === null;
    } else if (
      error instanceof WorkspaceError &&
      error.code === "permission-denied"
    ) {
      this.setFolderAction("open", "Open folder", "error");
      this.forgetFolderButton.hidden =
        this.mode === "folder" ||
        this.repository.getWorkspace() === null;
    }
  }
}
