import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../test/server";
import renderWithProviders from "../../test/renderWithProviders";
import EndpointViewer from ".";

describe("EndpointViewer", () => {
  it("should prompt to select an endpoint when some exist but none is active", async () => {
    renderWithProviders(<EndpointViewer />);

    expect(await screen.findByText(/select an endpoint/i)).toBeInTheDocument();
  });

  it("should show the no-endpoints empty state when none exist", async () => {
    server.use(http.get("*/endpoint", () => HttpResponse.json([])));

    renderWithProviders(<EndpointViewer />);

    expect(await screen.findByText(/no endpoints yet/i)).toBeInTheDocument();
  });
});
