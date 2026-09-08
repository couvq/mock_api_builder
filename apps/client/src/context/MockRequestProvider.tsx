import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import {
  serveMockRequest,
  type ServeMockRequestPayload,
} from "../api/mock_api";
import type { TranspiledSchema } from "@mock-api-builder/schema";

interface MockRequestProviderProps {
  children: ReactNode;
}

const MockRequestContext = createContext<
  | UseMutationResult<TranspiledSchema, Error, ServeMockRequestPayload>
  | undefined
>(undefined);

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
