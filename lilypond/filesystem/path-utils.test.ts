import { describe, expect, test } from "bun:test";
import { WorkspaceError } from "./errors";
import {
  appendPath,
  pathFromId,
  pathToDisplay,
  pathToId,
} from "./path-utils";

describe("workspace paths", () => {
  test("round-trips Unicode path segments without collisions", () => {
    const path = ["Scores", "Þema", "fiðla/part.ly"];
    expect(() => pathToId(path)).toThrow(WorkspaceError);

    const validPath = ["Scores", "Þema", "fiðla.ly"];
    expect(pathFromId(pathToId(validPath))).toEqual(validPath);
    expect(pathToDisplay(validPath)).toBe("Scores/Þema/fiðla.ly");
  });

  test("rejects traversal and separator segments", () => {
    expect(() => appendPath([], "..")).toThrow(WorkspaceError);
    expect(() => appendPath([], "parts/violin.ly")).toThrow(WorkspaceError);
    expect(() => pathFromId('["ok",42]')).toThrow(WorkspaceError);
  });

  test("gives the root its own stable id and display value", () => {
    expect(pathToId([])).toBe("[]");
    expect(pathFromId("[]")).toEqual([]);
    expect(pathToDisplay([])).toBe("/");
  });
});
