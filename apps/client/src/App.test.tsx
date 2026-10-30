import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { sampleEndpoint, server } from "./test/server";
import App from "./App";

const user = userEvent.setup();

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("App", () => {
  it("should support editing an endpoint configuration", async () => {
    render(<App />);

    const endpointBtnLabel = `${sampleEndpoint.method} ${sampleEndpoint.path}`;
    const endpointBtn = await screen.findByRole("button", {
      name: endpointBtnLabel,
    });
    await user.click(endpointBtn);

    // should display the endpoint config info we just clicked
    const endpointViewer = screen.getByTestId("endpoint-viewer");
    expect(endpointViewer).toHaveTextContent("GET");
    expect(endpointViewer).toHaveTextContent(
      "http://localhost:3000/v1/api/mock_api/",
    );
    const endpointPathInput = screen.getByRole("textbox", {
      name: /endpoint/i,
    });
    expect(endpointPathInput).toHaveValue("friend");

    // edit the endpoint path, should disable sending responses until we save
    await user.clear(endpointPathInput);
    await user.type(endpointPathInput, "best_friend");
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
  });
});
