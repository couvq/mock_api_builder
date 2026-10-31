import { MutationObserver } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { createQueryClient } from "./TanstackQueryProvider";

vi.mock("notistack", () => ({
  enqueueSnackbar: vi.fn(),
}));

describe("createQueryClient", () => {
  it("enqueues an error snackbar when a query errors", async () => {
    const client = createQueryClient();

    await client
      .query({
        queryKey: ["query-error"],
        queryFn: () => Promise.reject(new Error("query boom")),
        retry: false,
      })
      .catch(() => {});

    expect(enqueueSnackbar).toHaveBeenCalledWith("query boom", {
      variant: "error",
    });
  });

  it("enqueues an error snackbar when a mutation errors", async () => {
    const client = createQueryClient();
    const observer = new MutationObserver(client, {
      mutationFn: () => Promise.reject(new Error("mutation boom")),
      retry: false,
    });

    await observer.mutate().catch(() => {});

    expect(enqueueSnackbar).toHaveBeenCalledWith("mutation boom", {
      variant: "error",
    });
  });
});
