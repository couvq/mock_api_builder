import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import AddEndpointPanel from ".";
import renderWithProviders from "../../test/renderWithProviders";
import { sampleEndpoint, server } from "../../test/server";
import { http, HttpResponse } from "msw";

const user = userEvent.setup();

describe("AddEndpointPanel", () => {
  it("should filter endpoints based on the search input", async () => {
    const endpoints = [
      { ...sampleEndpoint, path: "friend" },
      { ...sampleEndpoint, path: "enemy" },
    ];

    server.use(
      http.get("*/endpoint", async () =>
        HttpResponse.json(endpoints, { status: 200 }),
      ),
    );
    renderWithProviders(<AddEndpointPanel />);
    expect(await screen.findByText("2 endpoints")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search endpoints");
    await user.type(searchInput, "friend");
    expect(await screen.findByText("1 endpoint")).toBeInTheDocument();
  });
});
