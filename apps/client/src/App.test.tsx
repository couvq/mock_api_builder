import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("should render the dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });
});
