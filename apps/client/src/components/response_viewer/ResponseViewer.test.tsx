import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import MockRequestProvider, {
  useMockRequest,
} from "../../context/MockRequest/MockRequestProvider";
import {
  sampleEndpoint,
  sampleMockApiResponse,
  server,
} from "../../test/server";
import ResponseViewer from ".";

const user = userEvent.setup();

// Fake btn to trigger our mock request endpoint via our tests
function Trigger() {
  const { mutate } = useMockRequest();
  return (
    <button
      onClick={() =>
        mutate({
          method: sampleEndpoint.method,
          path: sampleEndpoint.path,
        })
      }
    >
      send
    </button>
  );
}

function renderWithProviders(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MockRequestProvider>{ui}</MockRequestProvider>
    </QueryClientProvider>,
  );
}

describe("ResponseViewer", () => {
  it("should render the empty state before a request is sent", () => {
    renderWithProviders(<ResponseViewer />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it("should display the loading spinner while the request is pending", async () => {
    renderWithProviders(
      <>
        <Trigger />
        <ResponseViewer />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(
      await screen.findByTestId("response-viewer-loading"),
    ).toBeInTheDocument();
  });

  it("should display the json response on success", async () => {
    renderWithProviders(
      <>
        <Trigger />
        <ResponseViewer />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /send/i }));

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

  it("should display the error message on failure", async () => {
    const statusCode = 500;
    const statusText = "Internal Server Error";
    server.use(
      http.get(
        "*/mock_api/*",
        () => new HttpResponse(null, { status: statusCode, statusText }),
      ),
    );

    renderWithProviders(
      <>
        <Trigger />
        <ResponseViewer />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(
      await screen.findByText(
        `An error occurred calling mock endpoint: ${statusCode} ${statusText}`,
      ),
    ).toBeInTheDocument();
  });
});
