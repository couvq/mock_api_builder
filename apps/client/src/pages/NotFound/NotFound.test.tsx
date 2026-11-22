import { screen } from "@testing-library/react";
import NotFound from ".";
import renderWithProviders from "../../test/renderWithProviders";

describe("NotFound", () => {
  it("shows the not found heading", () => {
    renderWithProviders(<NotFound />);
    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
  });

  it("shows the path of the missing page", () => {
    renderWithProviders(<NotFound />, { initialEntries: ["/does-not-exist"] });
    expect(screen.getByText("/does-not-exist")).toBeInTheDocument();
  });

  it("links back to the dashboard", () => {
    renderWithProviders(<NotFound />);
    expect(
      screen.getByRole("link", { name: "Go to dashboard" }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
