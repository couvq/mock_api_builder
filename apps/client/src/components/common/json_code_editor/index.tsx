import { Box, Typography } from "@mui/material";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useMonacoTheme } from "../../../hooks/monacoTheme";

interface JsonCodeEditorProps<T> {
  /** Object rendered as formatted JSON; the source of truth for the editor. */
  value: T;
  /** Called with the parsed object whenever the edited JSON is valid. */
  onChange: (next: T) => void;
  /** Accessible name applied to the editor's text input. */
  label?: string;
}

/**
 * Monaco-based editor for editing a JSON value as formatted, multi-line text.
 * Theme-aware via `useMonacoTheme` and sized to fill its container. Parsing is
 * contained here: valid edits are parsed and reported through `onChange`, while
 * invalid JSON surfaces an inline error and is not propagated, so the parent
 * only ever receives well-formed values.
 */
const JsonCodeEditor = <T,>({
  value,
  onChange,
  label,
}: JsonCodeEditorProps<T>) => {
  const monacoTheme = useMonacoTheme();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (nextText: string | undefined) => {
    try {
      onChange(JSON.parse(nextText ?? "") as T);
      setError(null);
    } catch {
      setError("Invalid JSON");
    }
  };

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Editor
        height="100%"
        theme={monacoTheme}
        defaultLanguage="json"
        value={JSON.stringify(value, null, 2)}
        onChange={handleChange}
        options={{ ariaLabel: label }}
      />
      {error && (
        // Overlaid (not in flow) so an invalid-JSON message never changes the
        // editor's height, keeping it aligned with the sibling preview panel.
        <Typography
          role="alert"
          variant="caption"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            px: 1,
            py: 0.5,
            color: "error.contrastText",
            bgcolor: "error.main",
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default JsonCodeEditor;
