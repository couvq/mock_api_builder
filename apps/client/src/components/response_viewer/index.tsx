import { CircularProgress } from "@mui/material";
import { useMockRequest } from "../../context/MockRequestProvider";
import { JsonEditor } from "json-edit-react";

const ResponseViewer = () => {
  const { isPending, isError, error, data } = useMockRequest();

  if (isPending) return <CircularProgress />;

  if (isError) return error.message;

  if (data === undefined) return "Nothing here yet — try sending a request.";

  return <JsonEditor data={data} viewOnly />;
};

export default ResponseViewer;
