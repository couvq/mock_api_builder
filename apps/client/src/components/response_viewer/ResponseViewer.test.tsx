import { act, fireEvent, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { useMockRequest } from "../../context/MockRequest/MockRequestProvider";
import {
  sampleEndpoint,
  sampleMockApiResponse,
  server,
} from "../../test/server";
import renderWithProviders from "../../test/renderWithProviders";
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

describe("ResponseViewer", () => {
  it("should render the empty state before a request is sent", () => {
    renderWithProviders(<ResponseViewer />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it("should display the loading spinner while the request is pending", async () => {
    // Freeze the clock so the suite's 50ms response delay can't resolve while
    // we assert, pinning isPending=true regardless of CI timing. Two wrinkles
    // the fake clock introduces:
    //   - userEvent schedules its own timers and deadlocks against the frozen
    //     clock, so we dispatch the click synchronously with fireEvent.
    //   - React Query batches its state notifications on a 0ms timer that is
    //     also frozen, so the pending render never arrives on its own. We
    //     advance 1ms to fire that notification (but not the 50ms response),
    //     inside act() so the resulting re-render flushes.
    // Restoring real timers discards the still-pending response delay, so the
    // request is abandoned mid-flight (as unmount would) and no fake clock
    // leaks into the other tests.
    vi.useFakeTimers();
    try {
      renderWithProviders(
        <>
          <Trigger />
          <ResponseViewer />
        </>,
      );

      fireEvent.click(screen.getByRole("button", { name: /send/i }));
      await act(() => vi.advanceTimersByTimeAsync(1));

      expect(screen.getByTestId("response-viewer-loading")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
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
      await screen.findByText(`${statusCode} ${statusText}`),
    ).toBeInTheDocument();
  });

  it("should display a generic failure when no response is received", async () => {
    server.use(http.get("*/mock_api/*", () => HttpResponse.error()));

    renderWithProviders(
      <>
        <Trigger />
        <ResponseViewer />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(await screen.findByText("Request failed")).toBeInTheDocument();
  });
});
