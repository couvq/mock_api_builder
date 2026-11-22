import { useQuery } from "@tanstack/react-query";
import { getAllEndpoints, getEndpointById } from "../../api/endpoint";

export const useEndpoints = () => {
  return useQuery({
    queryKey: ["endpoints"],
    queryFn: getAllEndpoints,
  });
};

export const useEndpoint = (endpointId: string | undefined) => {
  return useQuery({
    queryKey: ["endpoints", endpointId],
    queryFn: () => getEndpointById(endpointId as string),
    enabled: Boolean(endpointId),
  });
};
