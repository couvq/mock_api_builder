import { useQuery } from "@tanstack/react-query";
import { getAllEndpoints } from "../../api/endpoint";

export const useEndpoints = () => {
  return useQuery({
    queryKey: ["endpoints"],
    queryFn: getAllEndpoints,
  });
};
