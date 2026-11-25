import { useColorScheme } from "@mui/material";

/**
 * Returns the Monaco editor theme that matches the app's active color scheme,
 * resolving the "system" setting to the OS preference so the JSON editor stays
 * in sync with the rest of the themed UI. Uses the custom "solarized-dark" /
 * "solarized-light" themes (registered in the editor's beforeMount), defaulting
 * to the light variant until a scheme is resolved.
 */
export const useMonacoTheme = () => {
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === "system" ? systemMode : mode;

  return resolvedMode === "dark" ? "solarized-dark" : "solarized-light";
};
