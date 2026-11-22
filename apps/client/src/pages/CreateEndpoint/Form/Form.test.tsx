import { fireEvent, screen, within } from "@testing-library/react";
import Form from ".";
import renderWithProviders from "../../../test/renderWithProviders";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { server } from "../../../test/server";
import { http, HttpResponse } from "msw";

const user = userEvent.setup();

// The example-response tree opens only to its root by default (collapse={1} in
// ResponseSchemaEditor), so nested collections render collapsed. Alt+click the
// root collapse control to expand the whole tree and reveal the generated
// values, then return queries scoped to the region.
const expandExampleResponse = () => {
  const region = screen.getByRole("region", { name: /example response/i });
  const collapseIcon = region.querySelector(".jer-collapse-icon");
  if (!collapseIcon)
    throw new Error("Example response collapse icon not found");
  fireEvent.click(collapseIcon, { altKey: true });
  return within(region);
};

describe("Form", () => {
  it("should show a success message when submitted with valid values", async () => {
    renderWithProviders(<Form />);

    await user.type(screen.getByLabelText(/path/i), "friend");
    await user.click(screen.getByRole("button", { name: /Create endpoint/i }));

    expect(
      await screen.findByText(/Endpoint .* created successfully!/i),
    ).toBeInTheDocument();
  });

  it("submits the configured delay", async () => {
    let captured: { delay: number } | undefined;
    server.use(
      http.post("*/endpoint", async ({ request }) => {
        captured = (await request.json()) as { delay: number };
        return HttpResponse.json(captured);
      }),
    );
    renderWithProviders(<Form />);

    await user.type(screen.getByLabelText(/path/i), "friend");
    // Clearing empties the field (value becomes null, falls back to 0);
    // one increment then steps it by 50.
    await user.clear(screen.getByLabelText(/delay/i));
    await user.click(screen.getByRole("button", { name: /increase/i }));
    await user.click(screen.getByRole("button", { name: /Create endpoint/i }));

    expect(
      await screen.findByText(/Endpoint .* created successfully!/i),
    ).toBeInTheDocument();
    expect(captured?.delay).toBe(50);
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

    const exampleResponse = expandExampleResponse();
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

    const exampleResponse = expandExampleResponse();
    expect(await exampleResponse.findByText(/hello/)).toBeInTheDocument();
  });
});
