import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { sampleEndpoint, sampleMockApiResponse, server } from "../test/server";
import { http, HttpResponse } from "msw";
import type { EndpointConfig } from "@mock-api-builder/schema";
import { MOCK_API_BASE_URL } from "../components/endpoint_viewer";
import Dashboard from "./Dashboard";
import TanstackQueryProvider from "../context/TanstackQueryProvider";
import type { ReactElement } from "react";
import ToastProvider from "../context/ToastProvider";
import EditorContextProvider from "../context/Editor/EditorContext";
import MockRequestProvider from "../context/MockRequest/MockRequestProvider";

const renderWithProviders = (ui: ReactElement) => {
  return render(
    <TanstackQueryProvider>
      <ToastProvider>
        <EditorContextProvider>
          <MockRequestProvider>{ui}</MockRequestProvider>
        </EditorContextProvider>
      </ToastProvider>
    </TanstackQueryProvider>,
  );
};

const user = userEvent.setup();

describe("Dashboard", () => {
  it("should support editing an endpoint configuration (full edit flow)", async () => {
    const editedEndpoint = {
      ...sampleEndpoint,
      method: "POST",
      path: "best_friend",
      responseSchema: { best_friends: [] },
    } satisfies EndpointConfig;

    const [initialKey] = Object.keys(sampleEndpoint.responseSchema);
    const [editedKey] = Object.keys(editedEndpoint.responseSchema);

    server.use(
      http.get("*/endpoint", () => HttpResponse.json([sampleEndpoint])),
    );
    renderWithProviders(<Dashboard />);

    // click the endpoint btn to enable editing in the endpoint viewer
    const endpointBtnLabel = `${sampleEndpoint.method} ${sampleEndpoint.path}`;
    const endpointBtn = await screen.findByRole("button", {
      name: endpointBtnLabel,
    });
    await user.click(endpointBtn);

    // should display the endpoint config info we just clicked
    const endpointViewer = screen.getByTestId("endpoint-viewer");
    expect(endpointViewer).toHaveTextContent(sampleEndpoint.method);
    expect(endpointViewer).toHaveTextContent(MOCK_API_BASE_URL);
    const endpointPathInput = screen.getByRole("textbox", {
      name: /endpoint/i,
    });
    expect(endpointPathInput).toHaveValue(sampleEndpoint.path);

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
    await user.clear(keyInput);
    await user.type(keyInput, `${editedKey}{Enter}`);

    // api should return the endpoint we just edited now, and capture the
    // PUT body so we can assert the save sent the edited config
    let putBody: EndpointConfig | undefined;
    server.use(
      http.get("*/endpoint", () => HttpResponse.json([editedEndpoint])),
      http.put("*/endpoint", async ({ request }) => {
        putBody = (await request.json()) as EndpointConfig;
        return HttpResponse.json(putBody);
      }),
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
    expect(putBody).toEqual(editedEndpoint);
    // once saved, sending is enabled again (the disabled button is swapped
    // for a fresh enabled one, so re-query rather than reuse sendBtn)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /send/i })).toBeEnabled(),
    );
  });

  it("should support sending mock requests for a given endpoint config (full send flow)", async () => {
    renderWithProviders(<Dashboard />);

    // click the endpoint btn to show the endpoint in the endpoint viewer
    const endpointBtnLabel = `${sampleEndpoint.method} ${sampleEndpoint.path}`;
    const endpointBtn = await screen.findByRole("button", {
      name: endpointBtnLabel,
    });
    await user.click(endpointBtn);

    // click the send btn to send a mock response
    const sendBtn = await screen.findByRole("button", {
      name: /send/i,
    });
    await user.click(sendBtn);

    // should display the mock response
    const responseJsonViewer = await screen.findByTestId(
      "response-json-viewer",
    );
    expect(responseJsonViewer).toBeInTheDocument();
    const [sampleMockResponseObjectKey] = Object.keys(sampleMockApiResponse);
    expect(responseJsonViewer).toHaveTextContent(sampleMockResponseObjectKey);
    for (const friend of sampleMockApiResponse.friends) {
      expect(responseJsonViewer).toHaveTextContent(friend);
    }
  });
});
