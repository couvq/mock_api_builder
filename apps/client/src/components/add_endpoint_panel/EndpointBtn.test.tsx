import type { EndpointConfig } from "@mock-api-builder/schema";
import { screen } from "@testing-library/react";
import renderWithProviders from "../../test/renderWithProviders";
import EndpointBtn from "./EndpointBtn";

describe("EndpointBtn component tests", () => {
  const endpointConfig: EndpointConfig = {
    id: "1",
    method: "GET",
    path: "friends",
    responseSchema: {},
  };

  it("should render the endpoint button", () => {
    renderWithProviders(<EndpointBtn endpoint={endpointConfig} />);

    const label = `${endpointConfig.method} ${endpointConfig.path}`;
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });
});
