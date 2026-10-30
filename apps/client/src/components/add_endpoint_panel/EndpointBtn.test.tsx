import type { EndpointConfig } from "@mock-api-builder/schema";
import { render, screen } from "@testing-library/react";
import EditorContextProvider from "../../context/Editor/EditorContext";
import EndpointBtn from "./EndpointBtn";

describe("EndpointBtn component tests", () => {
  const endpointConfig: EndpointConfig = {
    id: "1",
    method: "GET",
    path: "friends",
    responseSchema: {},
  };

  it("should render the endpoint button", () => {
    render(
      <EditorContextProvider>
        <EndpointBtn endpoint={endpointConfig} />
      </EditorContextProvider>,
    );

    const label = `${endpointConfig.method} ${endpointConfig.path}`;
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });
});
