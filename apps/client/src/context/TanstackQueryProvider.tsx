import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import type { ReactNode } from "react";

interface TanstackQueryProviderProps {
  children: ReactNode;
}

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }),
  });

const queryClient = createQueryClient();

const TanstackQueryProvider = ({ children }: TanstackQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
