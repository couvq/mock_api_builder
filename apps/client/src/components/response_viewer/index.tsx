import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useMockRequest } from "../../context/MockRequest/MockRequestProvider";
import { JsonEditor } from "json-edit-react";
import { useJsonEditorTheme } from "../../hooks/jsonEditorTheme";
import { MOCK_API_BASE_URL } from "../endpoint_viewer";
import { MockRequestError } from "../../api/mock_api";

const ResponseViewer = () => {
  const {
    isPending,
    isError,
    error,
    data: response,
    variables,
  } = useMockRequest();
  const jsonEditorTheme = useJsonEditorTheme();

  if (isPending)
    return (
      <Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Chip label="Sending..." color="info" />
          <Typography>
            {variables.method} {`${MOCK_API_BASE_URL}${variables.path}`}
          </Typography>
        </Stack>
        <CircularProgress data-testid="response-viewer-loading" />
      </Box>
    );

  if (isError)
    return (
      <Chip
        label={
          error instanceof MockRequestError
            ? `${error.status} ${error.statusText}`
            : "Request failed"
        }
        color="error"
      />
    );

  if (response === undefined)
    return <Typography>Nothing here yet — try sending a request.</Typography>;

  return (
    <Box data-testid="response-json-viewer">
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Chip
          label={`${response.status} ${response.statusText}`}
          color="success"
        />
        <Typography>
          {response.timeMs} ms {response.sizeBytes} B
        </Typography>
      </Stack>
      <JsonEditor data={response.data} theme={jsonEditorTheme} viewOnly />
    </Box>
  );
};

export default ResponseViewer;
