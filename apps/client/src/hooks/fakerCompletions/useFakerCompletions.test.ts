import { renderHook } from "@testing-library/react";
import { useMonaco } from "@monaco-editor/react";
import { FAKER_DESCRIPTIONS } from "../../config/fakerDescriptions";
import { getFakerCompletions, useFakerCompletions } from ".";

vi.mock("@monaco-editor/react", () => ({
  useMonaco: vi.fn(),
}));

describe("getFakerCompletions", () => {
  it("returns null when the cursor is not inside an open string", () => {
    expect(getFakerCompletions("  }")).toBeNull();
  });

  it("returns null for a string that is not heading toward 'fake'", () => {
    expect(getFakerCompletions('  "name": "hello')).toBeNull();
    // Shares a prefix with "fake" but then diverges.
    expect(getFakerCompletions('  "name": "far')).toBeNull();
  });

  it("returns null for an empty value (the just-opened quote)", () => {
    expect(getFakerCompletions('  "newField": "')).toBeNull();
  });

  // Regression: suggestions must engage from the first character so Monaco
  // keeps the provider in its suggest session while a new value is typed.
  it("engages from the first character of a faker value", () => {
    const result = getFakerCompletions('  "newField": "f');
    expect(result?.typed).toBe("f");
    expect(result?.items.length).toBeGreaterThan(200);
  });

  it("offers the matching faker types with their descriptions", () => {
    const result = getFakerCompletions('  "name": "fake.person');

    expect(result?.typed).toBe("fake.person");
    expect(result?.items).toContainEqual({
      type: "fake.person.firstName",
      description: FAKER_DESCRIPTIONS["fake.person.firstName"],
    });
    // Scoped to the person module.
    expect(
      result?.items.every((item) => item.type.startsWith("fake.person")),
    ).toBe(true);
  });

  it("offers every type once 'fake.' is typed", () => {
    const result = getFakerCompletions('"fake.');
    expect(result?.items.length).toBeGreaterThan(200);
  });
});

describe("useFakerCompletions", () => {
  let dispose: ReturnType<typeof vi.fn>;
  let registerCompletionItemProvider: ReturnType<typeof vi.fn>;
  let monacoStub: NonNullable<ReturnType<typeof useMonaco>>;

  beforeEach(() => {
    dispose = vi.fn();
    registerCompletionItemProvider = vi.fn(() => ({ dispose }));
    monacoStub = {
      languages: {
        registerCompletionItemProvider,
        CompletionItemKind: { Value: 12 },
      },
    } as unknown as NonNullable<ReturnType<typeof useMonaco>>;
  });

  const provider = () =>
    registerCompletionItemProvider.mock.calls[0][1] as {
      provideCompletionItems: (
        model: { getValueInRange: () => string },
        position: { lineNumber: number; column: number },
      ) => { suggestions: Record<string, unknown>[]; incomplete?: boolean };
    };

  it("does not register until the monaco instance is ready", () => {
    vi.mocked(useMonaco).mockReturnValue(null);
    renderHook(() => useFakerCompletions());
    expect(registerCompletionItemProvider).not.toHaveBeenCalled();
  });

  it("registers a json completion provider and disposes it on unmount", () => {
    vi.mocked(useMonaco).mockReturnValue(monacoStub);

    const { unmount } = renderHook(() => useFakerCompletions());

    expect(registerCompletionItemProvider).toHaveBeenCalledWith(
      "json",
      expect.any(Object),
    );

    unmount();
    expect(dispose).toHaveBeenCalled();
  });

  it("maps faker completions to Monaco suggestions over the typed range", () => {
    vi.mocked(useMonaco).mockReturnValue(monacoStub);
    renderHook(() => useFakerCompletions());

    const { suggestions } = provider().provideCompletionItems(
      { getValueInRange: () => '  "name": "fake.person' },
      { lineNumber: 1, column: 23 },
    );

    const firstName = suggestions.find(
      (s) => s.label === "fake.person.firstName",
    );
    expect(firstName).toMatchObject({
      insertText: "fake.person.firstName",
      documentation: { value: FAKER_DESCRIPTIONS["fake.person.firstName"] },
      // column (23) minus the length of "fake.person" (11).
      range: { startColumn: 12, endColumn: 23 },
    });
  });

  it("returns no suggestions outside a faker string", () => {
    vi.mocked(useMonaco).mockReturnValue(monacoStub);
    renderHook(() => useFakerCompletions());

    const { suggestions } = provider().provideCompletionItems(
      { getValueInRange: () => '  "name": "hello' },
      { lineNumber: 1, column: 17 },
    );

    expect(suggestions).toHaveLength(0);
  });

  // `incomplete` keeps Monaco re-querying this provider as each character is
  // typed instead of caching one list and filtering it, so the replace range
  // stays correct as a faker path grows past a ".".
  it("marks every result incomplete so Monaco re-queries on each keystroke", () => {
    vi.mocked(useMonaco).mockReturnValue(monacoStub);
    renderHook(() => useFakerCompletions());

    const matched = provider().provideCompletionItems(
      { getValueInRange: () => '  "name": "fake.person' },
      { lineNumber: 1, column: 23 },
    );
    const empty = provider().provideCompletionItems(
      { getValueInRange: () => '  "name": "' },
      { lineNumber: 1, column: 12 },
    );

    expect(matched.incomplete).toBe(true);
    expect(empty.incomplete).toBe(true);
  });
});
