import { QueryClient } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import EditEndpoint from ".";
import renderWithProviders from "../../test/renderWithProviders";
import { sampleEndpoint, server } from "../../test/server";

const renderAt = (entry: string) =>
  renderWithProviders(<EditEndpoint />, { initialEntries: [entry] });

describe("EditEndpoint", () => {
  it("renders the Edit Endpoint heading", () => {
    renderAt(`/endpoint/edit?endpointId=${sampleEndpoint.id}`);
    expect(screen.getByText("Edit Endpoint")).toBeInTheDocument();
  });

  it("shows a loading indicator while fetching the endpoint", () => {
    renderAt(`/endpoint/edit?endpointId=${sampleEndpoint.id}`);
    expect(screen.getByLabelText("Loading endpoint")).toBeInTheDocument();
  });

  it("prefills the form with the fetched endpoint's values", async () => {
    renderAt(`/endpoint/edit?endpointId=${sampleEndpoint.id}`);

    expect(
      await screen.findByDisplayValue(sampleEndpoint.path),
    ).toBeInTheDocument();
  });

  it("warns when no endpointId query param is provided", () => {
    renderAt("/endpoint/edit");

    expect(screen.getByText(/No endpoint selected\./i)).toBeInTheDocument();
  });

  it("shows an error when the endpoint cannot be found", async () => {
    const statusCode = 404;
    const statusText = "Not Found";
    server.use(
      http.get(
        "*/endpoint/:id",
        async () => new HttpResponse(null, { status: statusCode, statusText }),
      ),
    );
    renderAt(`/endpoint/edit?endpointId=${sampleEndpoint.id}`);

    expect(
      await screen.findByText(
        `Failed to fetch endpoint: ${statusCode} ${statusText}`,
      ),
    ).toBeInTheDocument();
  });

  it("prefills from fresh server data rather than a stale cache entry", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.setQueryData(["endpoints", sampleEndpoint.id], {
      ...sampleEndpoint,
      path: "/stale-path",
    });
    renderWithProviders(<EditEndpoint />, {
      initialEntries: [`/endpoint/edit?endpointId=${sampleEndpoint.id}`],
      queryClient,
    });

    expect(
      await screen.findByDisplayValue(sampleEndpoint.path),
    ).toBeInTheDocument();
    expect(screen.queryByDisplayValue("/stale-path")).not.toBeInTheDocument();
  });
});
