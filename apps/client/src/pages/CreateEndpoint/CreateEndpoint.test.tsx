import { render, screen } from "@testing-library/react";
import CreateEndpoint from ".";

describe("CreateEndpoint", () => {
  it("renders the CreateEndpoint component", () => {
    render(<CreateEndpoint />);
    expect(screen.getByText("CreateEndpoint")).toBeInTheDocument();
  });
});
