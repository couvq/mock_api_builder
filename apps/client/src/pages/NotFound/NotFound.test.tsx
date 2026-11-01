import { render, screen } from "@testing-library/react";
import NotFound from ".";

describe("NotFound", () => {
  it("renders the NotFound component", () => {
    render(<NotFound />);
    expect(screen.getByText("NotFound")).toBeInTheDocument();
  });
});
