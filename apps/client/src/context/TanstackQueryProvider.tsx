import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useState, type ReactNode } from "react";

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

const TanstackQueryProvider = ({ children }: TanstackQueryProviderProps) => {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
