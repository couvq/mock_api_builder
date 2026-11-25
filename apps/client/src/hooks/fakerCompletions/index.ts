import { FakerSchema, type FakerType } from "@mock-api-builder/schema";
import { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { FAKER_DESCRIPTIONS } from "../../config/fakerDescriptions";

const FAKER_TYPES = FakerSchema.options;

interface FakerCompletion {
  type: FakerType;
  description: string;
}

/**
 * Given the current line's text up to the cursor, returns the faker-type
 * completions to offer and the already-typed text they should replace, or null
 * when the cursor is not inside a string value that begins with "fake".
 *
 * Gating on the full "fake" prefix keeps the ~250 suggestions out of ordinary
 * string values; it does not distinguish keys from values, so a key typed as
 * "fake…" would also see them.
 */
export const getFakerCompletions = (
  lineUpToCursor: string,
): { typed: string; items: FakerCompletion[] } | null => {
  // The still-unclosed string the cursor sits in, and its content so far.
  const openString = /"([^"\\]*)$/.exec(lineUpToCursor);
  if (!openString) return null;

  const typed = openString[1];
  if (!typed.startsWith("fake")) return null;

  const items = FAKER_TYPES.filter((type) => type.startsWith(typed)).map(
    (type) => ({ type, description: FAKER_DESCRIPTIONS[type] }),
  );
  return { typed, items };
};

/**
 * Registers a Monaco completion provider that suggests the project's faker
 * types (each with a description of the data it returns) while editing a JSON
 * string value. Suggestions only: unrecognised strings are never flagged.
 */
export const useFakerCompletions = () => {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    const provider = monaco.languages.registerCompletionItemProvider("json", {
      triggerCharacters: ['"', "."],
      provideCompletionItems: (model, position) => {
        const lineUpToCursor = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const completion = getFakerCompletions(lineUpToCursor);
        if (!completion) return { suggestions: [] };

        const { typed, items } = completion;
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column - typed.length,
          endColumn: position.column,
        };

        return {
          suggestions: items.map((item) => ({
            label: item.type,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: item.type,
            filterText: item.type,
            detail: "Faker type",
            documentation: { value: item.description },
            range,
          })),
        };
      },
    });

    return () => provider.dispose();
  }, [monaco]);
};
