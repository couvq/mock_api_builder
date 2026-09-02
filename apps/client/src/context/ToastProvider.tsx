import { SnackbarProvider } from "notistack";
import type { ReactNode } from "react";

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={5000}
    >
      {children}
    </SnackbarProvider>
  );
};

export default ToastProvider;
