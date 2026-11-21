import { screen } from "@testing-library/react";
import renderWithProviders from "../../test/renderWithProviders";
import EditEndpointBtn from "./EditEndpointBtn";

describe("EditEndpointBtn", () => {
  it("should render an edit link pointing at the edit page for the endpoint", () => {
    renderWithProviders(<EditEndpointBtn endpointId="123" />);

    const editLink = screen.getByLabelText("edit");
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/endpoint/edit?endpointId=123");
  });
});
