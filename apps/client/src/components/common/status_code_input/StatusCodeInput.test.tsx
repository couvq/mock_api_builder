import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import StatusCodeInput from ".";
import renderWithProviders from "../../../test/renderWithProviders";

const user = userEvent.setup();

describe("StatusCodeInput", () => {
  it("shows the selected code with its reason phrase", () => {
    renderWithProviders(
      <StatusCodeInput value={201} onValueChange={vi.fn()} />,
    );

    expect(screen.getByText(/201 Created/i)).toBeInTheDocument();
  });

  it("reports the chosen code to onValueChange as a number", async () => {
    const onValueChange = vi.fn();
    renderWithProviders(
      <StatusCodeInput value={200} onValueChange={onValueChange} />,
    );

    await user.click(screen.getByLabelText(/status code/i));
    await user.click(
      await screen.findByRole("option", { name: /404 Not Found/i }),
    );

    expect(onValueChange).toHaveBeenCalledWith(404);
  });

  it("still lists a stored code that is not a standard HTTP status code", () => {
    renderWithProviders(
      <StatusCodeInput value={299} onValueChange={vi.fn()} />,
    );

    // 299 is within the schema's range but has no reason phrase, so it falls
    // back to showing the bare code — the field is never blank.
    expect(screen.getByText("299")).toBeInTheDocument();
  });
});
