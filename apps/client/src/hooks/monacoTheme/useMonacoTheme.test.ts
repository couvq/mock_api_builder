import { renderHook } from "@testing-library/react";
import { useColorScheme } from "@mui/material";
import { useMonacoTheme } from ".";

vi.mock("@mui/material", () => ({
  useColorScheme: vi.fn(),
}));

const stubColorScheme = (mode?: string, systemMode?: string) => {
  vi.mocked(useColorScheme).mockReturnValue({
    mode,
    systemMode,
  } as ReturnType<typeof useColorScheme>);
};

describe("useMonacoTheme", () => {
  it("returns the dark theme in dark mode", () => {
    stubColorScheme("dark");
    const { result } = renderHook(() => useMonacoTheme());
    expect(result.current).toBe("solarized-dark");
  });

  it("returns the light theme in light mode", () => {
    stubColorScheme("light");
    const { result } = renderHook(() => useMonacoTheme());
    expect(result.current).toBe("solarized-light");
  });

  it("follows the system preference when the mode is system", () => {
    stubColorScheme("system", "dark");
    const { result } = renderHook(() => useMonacoTheme());
    expect(result.current).toBe("solarized-dark");
  });

  it("falls back to the light theme when no scheme is resolved", () => {
    stubColorScheme(undefined);
    const { result } = renderHook(() => useMonacoTheme());
    expect(result.current).toBe("solarized-light");
  });
});
