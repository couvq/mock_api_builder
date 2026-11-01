import { renderHook } from "@testing-library/react";
import { useSnackbar } from "notistack";
import { useToast } from ".";

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

describe("useToast", () => {
  const enqueueSnackbar = vi.fn();

  beforeEach(() => {
    vi.mocked(useSnackbar).mockReturnValue({
      enqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
  });

  it("queues success messages with the success variant", () => {
    const { result } = renderHook(() => useToast());
    result.current.success("This is a success message");
    expect(enqueueSnackbar).toHaveBeenCalledWith("This is a success message", {
      variant: "success",
    });
  });

  it("queues error messages with the error variant", () => {
    const { result } = renderHook(() => useToast());
    result.current.error("This is an error message");
    expect(enqueueSnackbar).toHaveBeenCalledWith("This is an error message", {
      variant: "error",
    });
  });
});
