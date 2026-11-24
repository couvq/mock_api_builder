import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { http, HttpResponse } from "msw";
import renderWithProviders from "../../test/renderWithProviders";
import { server } from "../../test/server";
import ConfirmDeletionModal from "./ConfirmDeletionModal";
import type { EndpointConfig } from "@mock-api-builder/schema";

const endpoint: EndpointConfig = {
  id: "1",
  method: "GET",
  path: "friends",
  statusCode: 200,
  delay: 0,
  responseSchema: {},
};

const endpointLabel = `${endpoint.method} /${endpoint.path}`;

const user = userEvent.setup();

describe("ConfirmDeletionModal", () => {
  it("should be able to confirm deletion", async () => {
    renderWithProviders(
      <ConfirmDeletionModal isOpen endpoint={endpoint} onClose={() => {}} />,
    );

    const confirmationInput = screen.getByRole("textbox");
    await user.type(confirmationInput, endpointLabel);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await user.click(confirmButton);

    expect(
      await screen.findByText("Endpoint deleted successfully."),
    ).toBeInTheDocument();
  });

  it("should show a validation error when the confirmation input does not match", async () => {
    renderWithProviders(
      <ConfirmDeletionModal isOpen endpoint={endpoint} onClose={() => {}} />,
    );

    const confirmationInput = screen.getByRole("textbox");
    await user.type(confirmationInput, "not the endpoint");

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await user.click(confirmButton);

    expect(
      await screen.findByText(`Value must be ${endpointLabel}`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Endpoint deleted successfully."),
    ).not.toBeInTheDocument();
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
    renderWithProviders(
      <ConfirmDeletionModal isOpen endpoint={endpoint} onClose={() => {}} />,
    );

    const confirmationInput = screen.getByRole("textbox");
    await user.type(confirmationInput, endpointLabel);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await user.click(confirmButton);

    expect(
      await screen.findByText("Failed to delete endpoint."),
    ).toBeInTheDocument();
  });

  it("should copy the endpoint label to the clipboard", async () => {
    renderWithProviders(
      <ConfirmDeletionModal isOpen endpoint={endpoint} onClose={() => {}} />,
    );

    await user.click(
      screen.getByRole("button", { name: "copy endpoint name" }),
    );

    expect(await navigator.clipboard.readText()).toBe(endpointLabel);
    expect(await screen.findByText("Copied to clipboard.")).toBeInTheDocument();
  });

  it("should show an error if copying to the clipboard fails", async () => {
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(
      new Error("denied"),
    );
    renderWithProviders(
      <ConfirmDeletionModal isOpen endpoint={endpoint} onClose={() => {}} />,
    );

    await user.click(
      screen.getByRole("button", { name: "copy endpoint name" }),
    );

    expect(
      await screen.findByText("Failed to copy to clipboard."),
    ).toBeInTheDocument();
  });
});
