import { renderHook } from "@testing-library/react";
import { useEditor, useEditorDispatch } from "./EditorContext";
import type { MockInstance } from "vitest";

describe("Editor Context hooks", () => {
  let consoleSpy: MockInstance<typeof console.error>; // prevents console errors from bloating our testing console

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("useEditor throws an error when called outside of a EditorContextProvider", () => {
    expect(() => renderHook(() => useEditor())).toThrow(
      "useEditor hook must be used within a EditorContextProvider",
    );
  });

  it("useEditorDispatch throws an error when called outside of a EditorContextProvider", () => {
    expect(() => renderHook(() => useEditorDispatch())).toThrow(
      "useEditorDispatch hook must be used within a EditorContextProvider",
    );
  });
});
