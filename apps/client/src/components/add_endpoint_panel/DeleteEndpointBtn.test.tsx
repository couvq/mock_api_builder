import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { http, HttpResponse } from "msw";
import renderWithProviders from "../../test/renderWithProviders";
import { server } from "../../test/server";
import DeleteEndpointBtn from "./DeleteEndpointBtn";

const user = userEvent.setup();

describe("DeleteEndpointBtn", () => {
  it("should be able to confirm deletion", async () => {
    renderWithProviders(<DeleteEndpointBtn endpointId="1" />);

    const deleteButton = screen.getByLabelText("delete");
    await user.click(deleteButton);

    const confirmationModal = await screen.findByRole("alertdialog");
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await user.click(confirmButton);

    expect(
      await screen.findByText("Endpoint deleted successfully."),
    ).toBeInTheDocument();
  });

  it("should show an error message if deletion fails", async () => {
    server.use(
      http.delete(
        "*/endpoint/:id",
        async () =>
          new HttpResponse(null, {
            status: 500,
            statusText: "Internal Server Error",
          }),
      ),
    );
    renderWithProviders(<DeleteEndpointBtn endpointId="1" />);

    const deleteButton = screen.getByLabelText("delete");
    await user.click(deleteButton);

    const confirmationModal = await screen.findByRole("alertdialog");
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await user.click(confirmButton);

    expect(
      await screen.findByText("Failed to delete endpoint."),
    ).toBeInTheDocument();
  });
});
