import { useColorScheme } from "@mui/material";
import {
  darkJsonEditorTheme,
  lightJsonEditorTheme,
} from "../../config/jsonEditorTheme";

/**
 * Returns the json-edit-react theme that matches the app's active color scheme,
 * resolving the "system" setting to the OS preference so the JSON editors stay
 * in sync with the rest of the themed UI. Falls back to the light theme until a
 * scheme is resolved.
 */
export const useJsonEditorTheme = () => {
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === "system" ? systemMode : mode;

  return resolvedMode === "dark" ? darkJsonEditorTheme : lightJsonEditorTheme;
};
