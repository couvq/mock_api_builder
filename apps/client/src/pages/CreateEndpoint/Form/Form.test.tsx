import { screen, within } from "@testing-library/react";
import Form from ".";
import renderWithProviders from "../../../test/renderWithProviders";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { server } from "../../../test/server";
import { http, HttpResponse } from "msw";

const user = userEvent.setup();

describe("Form", () => {
  it("should show a success message when submitted with valid values", async () => {
    renderWithProviders(<Form />);

    await user.type(screen.getByLabelText(/path/i), "friend");
    await user.click(screen.getByRole("button", { name: /Create endpoint/i }));

    expect(
      await screen.findByText(/Endpoint .* created successfully!/i),
    ).toBeInTheDocument();
  });

  it("should show an error message if failed to create endpoint", async () => {
    server.use(
      http.post(
        "*/endpoint",
        async () =>
          new HttpResponse(null, {
            status: 500,
            statusText: "Internal Server Error",
          }),
      ),
    );
    renderWithProviders(<Form />);

    await user.type(screen.getByLabelText(/path/i), "friend");
    await user.click(screen.getByRole("button", { name: /Create endpoint/i }));

    expect(
      await screen.findByText(/Failed to create endpoint. Please try again./i),
    ).toBeInTheDocument();
  });

  it("can toggle between tree and json view modes", async () => {
    renderWithProviders(<Form />);

    const treeButton = screen.getByRole("button", { name: /TREE/i });
    const jsonButton = screen.getByRole("button", { name: /EDIT JSON/i });

    // Default view mode is tree
    expect(treeButton).toHaveAttribute("aria-pressed", "true");
    expect(jsonButton).toHaveAttribute("aria-pressed", "false");

    await user.click(jsonButton);
    expect(treeButton).toHaveAttribute("aria-pressed", "false");
    expect(jsonButton).toHaveAttribute("aria-pressed", "true");

    await user.click(treeButton);
    expect(treeButton).toHaveAttribute("aria-pressed", "true");
    expect(jsonButton).toHaveAttribute("aria-pressed", "false");
  });

  it("should show transpiled response when editing json response in editor", async () => {
    renderWithProviders(<Form />);

    const jsonButton = screen.getByRole("button", { name: /EDIT JSON/i });
    await user.click(jsonButton);

    const jsonEditor = screen.getByRole("textbox", {
      name: /responseSchemaEditor/i,
    });
    await user.clear(jsonEditor);
    await user.click(jsonEditor);
    await user.paste('{"friends":["Alice","Bob"]}');

    const exampleResponse = within(
      screen.getByRole("region", { name: /example response/i }),
    );
    expect(await exampleResponse.findByText(/Alice/)).toBeInTheDocument();
    expect(await exampleResponse.findByText(/Bob/)).toBeInTheDocument();
  });

  it("re-transpiles the schema into the example response when Regenerate is clicked", async () => {
    renderWithProviders(<Form />);

    const jsonButton = screen.getByRole("button", { name: /EDIT JSON/i });
    await user.click(jsonButton);

    const jsonEditor = screen.getByRole("textbox", {
      name: /responseSchemaEditor/i,
    });
    await user.clear(jsonEditor);
    await user.click(jsonEditor);
    await user.paste('{"greeting":"hello"}');

    await user.click(screen.getByRole("button", { name: /Regenerate/i }));

    const exampleResponse = within(
      screen.getByRole("region", { name: /example response/i }),
    );
    expect(await exampleResponse.findByText(/hello/)).toBeInTheDocument();
  });
});
