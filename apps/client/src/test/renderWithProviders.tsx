import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import EditorContextProvider from "../context/Editor/EditorContext";
import MockRequestProvider from "../context/MockRequest/MockRequestProvider";
import ToastProvider from "../context/ToastProvider";

/**
 * Renders `ui` wrapped in the full app provider stack for tests.
 *
 * A fresh QueryClient is created per call (no cross-test cache leakage) and
 * tuned for deterministic tests: retries off so error states surface
 * immediately, and `gcTime: 0` so nothing lingers between renders.
 */
const renderWithProviders = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <EditorContextProvider>
            <MockRequestProvider>{ui}</MockRequestProvider>
          </EditorContextProvider>
        </ToastProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

export default renderWithProviders;
