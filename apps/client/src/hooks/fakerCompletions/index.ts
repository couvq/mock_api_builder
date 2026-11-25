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
 * when the cursor is not inside a string value that is (heading toward) a faker
 * type.
 *
 * The gate matches a value that is a prefix of "fake" ("f", "fa", …) or already
 * past it ("fake", "fake.person", …). Returning items from the very first
 * character is deliberate — see the note in the provider — yet still keeps the
 * ~250 suggestions out of ordinary strings, which rarely begin with "f". It
 * does not distinguish keys from values, so a key typed as "fake…" sees them.
 */
export const getFakerCompletions = (
  lineUpToCursor: string,
): { typed: string; items: FakerCompletion[] } | null => {
  // The still-unclosed string the cursor sits in, and its content so far.
  const openString = /"([^"\\]*)$/.exec(lineUpToCursor);
  if (!openString) return null;

  const typed = openString[1];
  // Engage as soon as the value heads toward a faker type ("f", "fa", …) and
  // stay engaged once past it ("fake", "fake.person", …). Returning items from
  // the first character keeps this provider in Monaco's active suggest session
  // so it keeps filtering as the value is typed; a provider that stays empty
  // until "fake" is complete gets dropped from the session and is never
  // re-queried (only a trigger character such as "." revives it) — which is why
  // suggestions never appeared while adding a new value.
  if (typed.length === 0) return null;
  if (!"fake".startsWith(typed) && !typed.startsWith("fake")) return null;

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
        // Stay `incomplete` even with nothing to offer so Monaco keeps this
        // provider in the suggest session and asks again on the next keystroke
        // (see the populated result below for why re-querying matters).
        if (!completion) return { suggestions: [], incomplete: true };

        const { typed, items } = completion;
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column - typed.length,
          endColumn: position.column,
        };

        return {
          // `incomplete` re-queries this provider on every keystroke instead of
          // letting Monaco cache one list and filter it itself. That keeps
          // `range` in step with the growing value — essential once a "." is
          // typed — so accepting a suggestion replaces the whole faker path.
          incomplete: true,
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
