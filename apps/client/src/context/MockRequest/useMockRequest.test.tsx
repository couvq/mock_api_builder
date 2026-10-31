import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import MockRequestProvider, { useMockRequest } from "./MockRequestProvider";

describe("useMockRequest", () => {
  it("throws an error when called outside of a MockRequestProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useMockRequest())).toThrow(
      "Cannot call useMockRequest outside of a MockRequestProvider.",
    );

    spy.mockRestore();
  });

  it("returns the mutation result when used inside the provider", () => {
    const client = new QueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>
        <MockRequestProvider>{children}</MockRequestProvider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useMockRequest(), { wrapper });

    expect(result.current.mutate).toBeTypeOf("function");
    expect(result.current.isPending).toBe(false);
  });
});
