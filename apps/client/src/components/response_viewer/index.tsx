import { CircularProgress } from "@mui/material";
import { useMockRequest } from "../../context/MockRequestProvider";

const ResponseViewer = () => {
  const serveMockRequestMutation = useMockRequest();

  if (serveMockRequestMutation.isPending) return <CircularProgress />;

  if (serveMockRequestMutation.isError)
    return serveMockRequestMutation.error.message;

  return JSON.stringify(serveMockRequestMutation.data);
};

export default ResponseViewer;
