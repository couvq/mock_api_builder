import type { EndpointConfig } from "@mock-api-builder/schema";
import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import EditorContextProvider, * as EditorContext from "../../context/EditorContext";
import EndpointBtn from "./EndpointBtn";

describe("EndpointBtn component tests", () => {
  const endpointConfig: EndpointConfig = {
    id: "1",
    method: "GET",
    path: "friends",
    responseSchema: {},
  };
  const dispatch = vi.fn();
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    vi.spyOn(EditorContext, "useEditorDispatch").mockReturnValue(dispatch);
  });

  it("should render the endpoint button", () => {
    render(
      <EditorContextProvider>
        <EndpointBtn endpoint={endpointConfig} />
      </EditorContextProvider>,
    );

    const label = `${endpointConfig.method} ${endpointConfig.path}`;
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });

  it("should call dispatch with the correct endpoint config when clicked", async () => {
    render(
      <EditorContextProvider>
        <EndpointBtn endpoint={endpointConfig} />
      </EditorContextProvider>,
    );

    const label = `${endpointConfig.method} ${endpointConfig.path}`;
    await user.click(screen.getByRole("button", { name: label }));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: "ADD_ENDPOINT", endpoint: endpointConfig });
  });
});
