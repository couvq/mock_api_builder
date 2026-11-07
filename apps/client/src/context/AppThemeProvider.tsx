import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { ReactNode } from "react";

interface AppThemeProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
});

const AppThemeProvider = ({ children }: AppThemeProviderProps) => (
  <ThemeProvider theme={theme} defaultMode="system">
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default AppThemeProvider;
