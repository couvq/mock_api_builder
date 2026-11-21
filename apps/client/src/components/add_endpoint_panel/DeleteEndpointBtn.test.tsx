import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import renderWithProviders from "../../test/renderWithProviders";
import DeleteEndpointBtn from "./DeleteEndpointBtn";

const user = userEvent.setup();

describe("DeleteEndpointBtn", () => {
  it("should render a delete button", () => {
    renderWithProviders(<DeleteEndpointBtn onClick={() => {}} />);

    expect(screen.getByLabelText("delete")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const onClick = vi.fn();
    renderWithProviders(<DeleteEndpointBtn onClick={onClick} />);

    await user.click(screen.getByLabelText("delete"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
