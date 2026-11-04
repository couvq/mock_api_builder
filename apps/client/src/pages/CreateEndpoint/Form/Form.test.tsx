import { screen } from "@testing-library/react";
import Form from ".";
import renderWithProviders from "../../../test/renderWithProviders";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";

const user = userEvent.setup();

describe("Form", () => {
  it("should create a new endpoint when submitted with valid values", async () => {
    const alertMock = vi.fn(); // Mock alert to prevent actual alert pop-ups during tests
    vi.stubGlobal("alert", alertMock);
    renderWithProviders(<Form />);

    await user.type(screen.getByLabelText(/path/i), "friend");
    await user.click(screen.getByRole("button", { name: /Create endpoint/i }));
    expect(alertMock).toHaveBeenCalled();
  });
});
