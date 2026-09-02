import { useSnackbar } from "notistack";

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    error: (message: string) => {
      enqueueSnackbar(message, { variant: "error" });
    },
    success: (message: string) => {
      enqueueSnackbar(message, { variant: "success" });
    },
  };
};
