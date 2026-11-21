import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { sampleEndpoint, server } from "../../test/server";
import renderWithProviders from "../../test/renderWithProviders";
import EndpointList from "./EndpointList";
import { http, HttpResponse } from "msw";

const user = userEvent.setup();

describe("EndpointList", () => {
  it("should display the correct list of endpoints", async () => {
    renderWithProviders(<EndpointList filter={""} />);

    const label = `${sampleEndpoint.method} /${sampleEndpoint.path}`;
    const endpointBtn = await screen.findByRole("button", {
      name: label,
    });
    expect(endpointBtn).toBeInTheDocument();
  });

  it("should display loading skeleton while fetching endpoints", async () => {
    renderWithProviders(<EndpointList filter={""} />);

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
    renderWithProviders(<EndpointList filter={""} />);

    const errorMessage = await screen.findByText(
      `Failed to fetch endpoints: ${statusCode} ${statusText}`,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should open the delete confirmation modal when the delete button is clicked", async () => {
    renderWithProviders(<EndpointList filter={""} />);

    const deleteButton = await screen.findByLabelText("delete");
    await user.click(deleteButton);

    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });

  it("should close the delete confirmation modal when cancel is clicked", async () => {
    renderWithProviders(<EndpointList filter={""} />);

    const deleteButton = await screen.findByLabelText("delete");
    await user.click(deleteButton);

    const confirmationModal = await screen.findByRole("alertdialog");
    expect(confirmationModal).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
  });
});
