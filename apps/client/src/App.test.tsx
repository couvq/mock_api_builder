import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { sampleEndpoint, server } from "./test/server";
import App from "./App";
import { http, HttpResponse } from "msw";
import type { EndpointConfig } from "@mock-api-builder/schema";
import { MOCK_API_BASE_URL } from "./components/endpoint_viewer";

const user = userEvent.setup();

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("App", () => {
  it("should support editing an endpoint configuration (full edit flow)", async () => {
    const initialEndpoint = {
      ...sampleEndpoint,
      responseSchema: { friends: "firstName" },
    } satisfies EndpointConfig;

    const editedEndpoint = {
      ...initialEndpoint,
      method: "POST",
      path: "best_friend",
      responseSchema: { best_friends: "firstName" },
    } satisfies EndpointConfig;

    const [initialKey] = Object.keys(initialEndpoint.responseSchema);
    const [editedKey] = Object.keys(editedEndpoint.responseSchema);

    server.use(
      http.get("*/endpoint", () => HttpResponse.json([initialEndpoint])),
    );
    render(<App />);

    // click the endpoint btn to enable editing in the endpoint viewer
    const endpointBtnLabel = `${initialEndpoint.method} ${initialEndpoint.path}`;
    const endpointBtn = await screen.findByRole("button", {
      name: endpointBtnLabel,
    });
    await user.click(endpointBtn);

    // should display the endpoint config info we just clicked
    const endpointViewer = screen.getByTestId("endpoint-viewer");
    expect(endpointViewer).toHaveTextContent(initialEndpoint.method);
    expect(endpointViewer).toHaveTextContent(MOCK_API_BASE_URL);
    const endpointPathInput = screen.getByRole("textbox", {
      name: /endpoint/i,
    });
    expect(endpointPathInput).toHaveValue(initialEndpoint.path);

    // edit the endpoint config, should disable sending responses until we save
    // edit method
    await user.click(screen.getByRole("combobox"));
    await user.click(
      await screen.findByRole("option", { name: editedEndpoint.method }),
    );
    // edit path
    await user.clear(endpointPathInput);
    await user.type(endpointPathInput, editedEndpoint.path);
    // edit response schema
    await user.dblClick(screen.getByText(initialKey));
    const keyInput = screen.getByDisplayValue(initialKey);
    await user.type(keyInput, `${editedKey}{Enter}`);

    // api should return the endpoint we just edited now
    server.use(
      http.get("*/endpoint", () => HttpResponse.json([editedEndpoint])),
    );
    // disabled since we need to save our edits before we can send again
    const sendBtn = screen.getByRole("button", {
      name: /send/i,
    });
    expect(sendBtn).toBeDisabled();
    const saveBtn = screen.getByRole("button", {
      name: /save/i,
    });
    await user.click(saveBtn);
    expect(
      await screen.findByText("Endpoint saved successfully."),
    ).toBeInTheDocument();
    expect(saveBtn).toBeEnabled();
  });
});
