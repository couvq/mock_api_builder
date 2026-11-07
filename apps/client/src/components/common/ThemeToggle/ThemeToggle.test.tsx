import userEvent from "@testing-library/user-event";
import ThemeToggle from ".";
import renderWithProviders from "../../../test/renderWithProviders";
import { screen } from "@testing-library/react";

const user = userEvent.setup();

describe("ThemeToggle", () => {
  it("should display the correct icons for each mode", async () => {
    renderWithProviders(<ThemeToggle />);
    const lightModeIcon = await screen.findByLabelText("Turn dark mode on");
    await user.click(lightModeIcon);
    const darkModeIcon = await screen.findByLabelText("Turn light mode on");
    expect(darkModeIcon).toBeInTheDocument();
  });
});
