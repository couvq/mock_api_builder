import type { ThemeStyles } from "json-edit-react";

// A single color scheme's worth of JSON-editor tokens. The values mirror the
// design mock so the json-edit-react editors read as part of the themed UI
// instead of the library's light-only default (which looked washed out in dark
// mode).
interface JsonEditorPalette {
  surface: string; // editor background
  text: string; // default text + brackets
  key: string; // property names
  string: string;
  number: string;
  boolean: string;
  meta: string; // item counts + null values
  border: string;
  highlight: string; // active-input selection background
  accent: string; // edit / add / copy icons
  success: string; // confirm icon
  error: string; // delete icon + error text
}

const MONO_FONT_FAMILY =
  '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const lightPalette: JsonEditorPalette = {
  surface: "#f5f5f5",
  text: "#1f2328",
  key: "#1f2328",
  string: "#c1440e",
  number: "#1565c0",
  boolean: "#6a4fb3",
  meta: "#9aa0a6",
  border: "#d5d9de",
  highlight: "#e8f1fb",
  accent: "#1976d2",
  success: "#2e7d32",
  error: "#c62828",
};

const darkPalette: JsonEditorPalette = {
  surface: "#22262c",
  text: "#e7e9ec",
  key: "#e7e9ec",
  string: "#f08a5d",
  number: "#7fb3f5",
  boolean: "#b9a3f0",
  meta: "#6f767e",
  border: "#343a42",
  highlight: "#1d2b3c",
  accent: "#64a8f0",
  success: "#7ccf83",
  error: "#f2817b",
};

const buildJsonEditorTheme = (
  palette: JsonEditorPalette,
): Partial<ThemeStyles> => ({
  container: {
    backgroundColor: palette.surface,
    color: palette.text,
    fontFamily: MONO_FONT_FAMILY,
    border: `1px solid ${palette.border}`,
    borderRadius: "8px",
  },
  property: palette.key,
  bracket: palette.text,
  itemCount: { color: palette.meta, fontStyle: "italic" },
  string: palette.string,
  number: palette.number,
  boolean: palette.boolean,
  null: { color: palette.meta, fontVariant: "small-caps", fontWeight: "bold" },
  input: [palette.text],
  inputHighlight: palette.highlight,
  error: { fontSize: "0.8em", color: palette.error, fontWeight: "bold" },
  iconCollection: palette.meta,
  iconEdit: palette.accent,
  iconDelete: palette.error,
  iconAdd: palette.accent,
  iconCopy: palette.accent,
  iconOk: palette.success,
  iconCancel: palette.error,
});

export const lightJsonEditorTheme = buildJsonEditorTheme(lightPalette);
export const darkJsonEditorTheme = buildJsonEditorTheme(darkPalette);
