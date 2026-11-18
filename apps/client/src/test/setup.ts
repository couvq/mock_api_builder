import "@testing-library/jest-dom/vitest";
import { server } from "./server";

// This jsdom environment provides no localStorage, which MUI reads to resolve
// its color-scheme mode. Without it, `defaultMode="system"` falls back
// non-deterministically (it can settle to dark), which makes theme-dependent
// tests flaky. Provide a minimal localStorage and pin the mode to light before
// each test so color-scheme resolution is stable across the suite.
if (!window.localStorage) {
  const store = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    writable: true,
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key),
      clear: () => store.clear(),
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      get length() {
        return store.size;
      },
    },
  });
}

beforeEach(() => {
  window.localStorage.clear();
  // MUI persists the active color-scheme mode under this key.
  window.localStorage.setItem("mui-mode", "light");
});

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
