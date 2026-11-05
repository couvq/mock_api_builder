import { screen } from "@testing-library/react";
import CreateEndpoint from ".";
import renderWithProviders from "../../test/renderWithProviders";

describe("CreateEndpoint", () => {
  it("renders the CreateEndpoint component", () => {
    renderWithProviders(<CreateEndpoint />);
    expect(screen.getByText("New Endpoint")).toBeInTheDocument();
  });
});
