import { Alert, Box } from "@mui/material";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useFakerCompletions } from "../../../hooks/fakerCompletions";
import { useMonacoTheme } from "../../../hooks/monacoTheme";

interface JsonCodeEditorProps<T> {
  /** Object rendered as formatted JSON; the source of truth for the editor. */
  value: T;
  /** Called with the parsed object whenever the edited JSON is valid. */
  onChange: (next: T) => void;
  /** Accessible name applied to the editor's text input. */
  label?: string;
}

const JsonCodeEditor = <T,>({
  value,
  onChange,
  label,
}: JsonCodeEditorProps<T>) => {
  const monacoTheme = useMonacoTheme();
  const [errors, setErrors] = useState<string[]>([]);
  useFakerCompletions();

  const handleChange = (nextText: string | undefined) => {
    // Monaco reports the full document on every edit, but only hands us text;
    // parse it to lift the object up. Invalid JSON is surfaced by onValidate
    // (and Monaco's inline markers), so there is nothing to propagate here.
    try {
      onChange(JSON.parse(nextText ?? "") as T);
    } catch {
      /* ignored: reported via onValidate */
    }
  };

  return (
    // Column layout keeps the panel at its full height (so it stays aligned
    // with the sibling preview); when the alert appears the editor shrinks to
    // make room for it rather than being overlaid by it.
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* borderRadius + overflow clip Monaco's square corners to match the
          json-edit-react tree; fixedOverflowWidgets renders the autocomplete
          popup at the body so the clipping does not cut it off. */}
      <Box
        sx={{ flexGrow: 1, minHeight: 0, borderRadius: 2, overflow: "hidden" }}
      >
        <Editor
          height="100%"
          theme={monacoTheme}
          defaultLanguage="json"
          value={JSON.stringify(value, null, 2)}
          onChange={handleChange}
          onValidate={(markers) =>
            setErrors(markers.map((marker) => marker.message))
          }
          options={{
            ariaLabel: label,
            quickSuggestions: { strings: true },
            fixedOverflowWidgets: true,
          }}
        />
      </Box>
      {errors.length > 0 && (
        <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>
          Error with schema
        </Alert>
      )}
    </Box>
  );
};

export default JsonCodeEditor;
