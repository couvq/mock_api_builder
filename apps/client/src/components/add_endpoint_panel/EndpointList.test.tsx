import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import EditorContextProvider from "../../context/Editor/EditorContext";
import { sampleEndpoint, server } from "../../test/server";
import EndpointList from "./EndpointList";
import { http, HttpResponse } from "msw";

function renderWithProviders(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <EditorContextProvider>{ui}</EditorContextProvider>
    </QueryClientProvider>,
  );
}

describe("EndpointList", () => {
  it("should display the correct list of endpoints", async () => {
    renderWithProviders(<EndpointList />);

    const label = `${sampleEndpoint.method} ${sampleEndpoint.path}`;
    const endpointBtn = await screen.findByRole("button", {
      name: label,
    });
    expect(endpointBtn).toBeInTheDocument();
  });

  it("should display loading skeleton while fetching endpoints", async () => {
    renderWithProviders(<EndpointList />);

    const loadingSkeleton = await screen.findByTestId(
      "endpoint-list-loading-skeleton",
    );
    expect(loadingSkeleton).toBeInTheDocument();
  });

  it("should display error message when fetching endpoints fails", async () => {
    const statusCode = 500;
    const statusText = "Internal Server Error";
    server.use(
      http.get(
        "*/endpoint",
        async () => new HttpResponse(null, { status: statusCode, statusText }),
      ),
    );
    renderWithProviders(<EndpointList />);

    const errorMessage = await screen.findByText(
      `Failed to fetch endpoints: ${statusCode} ${statusText}`,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
