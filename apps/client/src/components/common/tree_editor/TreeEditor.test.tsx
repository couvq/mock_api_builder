import { screen } from "@testing-library/react";
import TreeEditor from ".";
import renderWithProviders from "../../../test/renderWithProviders";

describe("TreeEditor", () => {
  it("renders the forwarded data under the given root name", () => {
    renderWithProviders(
      <TreeEditor data={{ greeting: "hello" }} rootName="payload" />,
    );

    expect(screen.getByText("payload")).toBeInTheDocument();
    expect(screen.getByText(/hello/)).toBeInTheDocument();
  });
});
