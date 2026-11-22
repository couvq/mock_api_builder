import type { EndpointConfig } from "@mock-api-builder/schema";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { http, HttpResponse } from "msw";
import Form from ".";
import {
  useEditor,
  useEditorDispatch,
} from "../../../context/Editor/EditorContext";
import renderWithProviders from "../../../test/renderWithProviders";
import { sampleEndpoint, server } from "../../../test/server";

const user = userEvent.setup();

// Opens `endpoint` in the shared Editor context (as clicking a dashboard row
// does) and surfaces the resulting inline draft path for assertions.
const InlineEditorProbe = ({ endpoint }: { endpoint: EndpointConfig }) => {
  const dispatch = useEditorDispatch();
  const { draft } = useEditor();
  return (
    <>
      <button onClick={() => dispatch({ type: "ADD_ENDPOINT", endpoint })}>
        open inline
      </button>
      <div data-testid="inline-draft-path">{draft?.path}</div>
    </>
  );
};

describe("EditEndpoint Form", () => {
  it("prefills the form with the endpoint's values", () => {
    renderWithProviders(<Form endpoint={sampleEndpoint} />);

    expect(screen.getByLabelText(/path/i)).toHaveValue(sampleEndpoint.path);
  });

  it("saves changes via the update endpoint and shows a success message", async () => {
    let captured: { path: string } | undefined;
    server.use(
      http.put("*/endpoint", async ({ request }) => {
        captured = (await request.json()) as { path: string };
        return HttpResponse.json(captured);
      }),
    );
    renderWithProviders(<Form endpoint={sampleEndpoint} />);

    const pathInput = screen.getByLabelText(/path/i);
    await user.clear(pathInput);
    await user.type(pathInput, "friends");
    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    expect(
      await screen.findByText(/Endpoint .* updated successfully!/i),
    ).toBeInTheDocument();
    expect(captured?.path).toBe("friends");
  });

  it("sends the original endpoint id with the update", async () => {
    let captured: { id: string } | undefined;
    server.use(
      http.put("*/endpoint", async ({ request }) => {
        captured = (await request.json()) as { id: string };
        return HttpResponse.json(captured);
      }),
    );
    renderWithProviders(<Form endpoint={sampleEndpoint} />);

    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    await screen.findByText(/updated successfully!/i);
    expect(captured?.id).toBe(sampleEndpoint.id);
  });

  it("syncs the inline editor draft when the edited endpoint is open there", async () => {
    server.use(
      http.put("*/endpoint", async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
    );
    renderWithProviders(
      <>
        <InlineEditorProbe endpoint={sampleEndpoint} />
        <Form endpoint={sampleEndpoint} />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /open inline/i }));
    expect(screen.getByTestId("inline-draft-path")).toHaveTextContent(
      /^friend$/,
    );

    const pathInput = screen.getByLabelText(/path/i);
    await user.clear(pathInput);
    await user.type(pathInput, "friends");
    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    await screen.findByText(/updated successfully!/i);
    expect(screen.getByTestId("inline-draft-path")).toHaveTextContent(
      /^friends$/,
    );
  });

  it("leaves the inline draft untouched when a different endpoint is open there", async () => {
    const otherEndpoint: EndpointConfig = {
      ...sampleEndpoint,
      id: "999",
      path: "other",
    };
    renderWithProviders(
      <>
        <InlineEditorProbe endpoint={otherEndpoint} />
        <Form endpoint={sampleEndpoint} />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /open inline/i }));
    expect(screen.getByTestId("inline-draft-path")).toHaveTextContent(
      /^other$/,
    );

    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    await screen.findByText(/updated successfully!/i);
    expect(screen.getByTestId("inline-draft-path")).toHaveTextContent(
      /^other$/,
    );
  });

  it("shows an error message if the update fails", async () => {
    server.use(
      http.put(
        "*/endpoint",
        async () =>
          new HttpResponse(null, {
            status: 500,
            statusText: "Internal Server Error",
          }),
      ),
    );
    renderWithProviders(<Form endpoint={sampleEndpoint} />);

    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    expect(
      await screen.findByText(/Failed to update endpoint. Please try again./i),
    ).toBeInTheDocument();
  });
});
