import { CircularProgress } from "@mui/material";
import { useMockRequest } from "../../context/MockRequestProvider";

// TODO: need to strongly type useMockRequest
const ResponseViewer = () => {
  const serveMockRequestMutation = useMockRequest();

  // @ts-ignore
  if (serveMockRequestMutation.isPending) return <CircularProgress />;

  // @ts-ignore
  if (serveMockRequestMutation.isError)
     // @ts-ignore
    return serveMockRequestMutation.error.message;

  // @ts-ignore
  return JSON.stringify(serveMockRequestMutation.data);
};

export default ResponseViewer;
