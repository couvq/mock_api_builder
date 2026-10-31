import { CircularProgress } from "@mui/material";
import { useMockRequest } from "../../context/MockRequest/MockRequestProvider";
import { JsonEditor } from "json-edit-react";

const ResponseViewer = () => {
  const { isPending, isError, error, data } = useMockRequest();

  if (isPending)
    return <CircularProgress data-testid="response-viewer-loading" />;

  if (isError) return error.message;

  if (data === undefined) return "Nothing here yet — try sending a request.";

  return (
    <div data-testid="response-json-viewer">
      <JsonEditor data={data} viewOnly />
    </div>
  );
};

export default ResponseViewer;
