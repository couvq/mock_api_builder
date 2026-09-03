import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import { serveMockRequest } from "../api/mock_api";

interface MockRequestProviderProps {
  children: ReactNode;
}

// @ts-ignore
const MockRequestContext = createContext();

const MockRequestProvider = ({ children }: MockRequestProviderProps) => {
  const serveMockRequestMutation = useMutation({
    mutationFn: serveMockRequest,
  });

  return (
    <MockRequestContext value={serveMockRequestMutation}>
      {children}
    </MockRequestContext>
  );
};

export default MockRequestProvider;

export const useMockRequest = () => {
  const ctx = useContext(MockRequestContext);
  if (!ctx)
    throw new Error(
      "Cannot call useMockRequest outside of a MockRequestProvider.",
    );

  return ctx;
};
