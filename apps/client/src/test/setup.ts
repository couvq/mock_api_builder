import "@testing-library/jest-dom/vitest";
import { server } from "./server";

/*
 * This jsdom environment provides no localStorage, which MUI reads to resolve
 * its color-scheme mode. Without it, `defaultMode="system"` falls back
 * non-deterministically (it can settle to dark), which makes theme-dependent
 * tests flaky. Provide a minimal localStorage and pin the mode to light before
 * each test so color-scheme resolution is stable across the suite.
 */
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

/*
 * jsdom provides no ResizeObserver, which react-resizable-panels constructs
 * unconditionally when a Group mounts (to measure panel sizes). Provide a no-op
 * implementation so resizable layouts can mount in tests; sizes aren't measured
 * in jsdom regardless.
 */
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

/*
 * react-resizable-panels installs a document-level, capture-phase pointerdown
 * listener whose resize hit-test cancels the event whenever the pointer falls
 * within a Group's bounding box (expanded by ~20px). In jsdom every
 * getBoundingClientRect() is {0,0,0,0} and userEvent dispatches synthetic
 * clicks at (0,0), so every click "lands" in the resize zone; the cancelled
 * pointerdown then suppresses the mousedown MUI's Select opens on and blocks
 * subsequent userEvent typing. Report an off-origin rect for the library's own
 * Group elements (the element the hit-test measures) so (0,0) clicks miss it;
 * all other elements keep jsdom's default zero rect. Verified in a real browser
 * that normal clicks open the Select — this only compensates for jsdom's lack
 * of layout.
 */
const realGetBoundingClientRect = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function (this: Element) {
  if (this.hasAttribute("data-group")) {
    const far = 100000;
    return {
      x: far,
      y: far,
      width: 0,
      height: 0,
      top: far,
      left: far,
      right: far,
      bottom: far,
      toJSON: () => ({}),
    } as DOMRect;
  }
  return realGetBoundingClientRect.call(this);
};

beforeEach(() => {
  window.localStorage.clear();
  // MUI persists the active color-scheme mode under this key.
  window.localStorage.setItem("mui-mode", "light");
});

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
