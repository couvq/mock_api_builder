import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useMockRequest } from "../../context/MockRequest/MockRequestProvider";
import { JsonEditor } from "json-edit-react";
import { useJsonEditorTheme } from "../../hooks/jsonEditorTheme";
import { MOCK_API_BASE_URL } from "../endpoint_viewer";

const ResponseViewer = () => {
  const { isPending, isError, error, data, variables } = useMockRequest();
  const jsonEditorTheme = useJsonEditorTheme();

  if (isPending)
    return (
      <Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Chip label="Sending..." />
          <Typography>
            {variables.method} {`${MOCK_API_BASE_URL}${variables.path}`}
          </Typography>
        </Stack>
        <CircularProgress data-testid="response-viewer-loading" />
      </Box>
    );

  if (isError) return error.message;

  if (data === undefined) return "Nothing here yet — try sending a request.";

  return (
    <Box data-testid="response-json-viewer">
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Chip label={`${data.status}`} />
        <Typography>
          {data.responseTimeMs} ms {data.responseSizeBytes} B
        </Typography>
      </Stack>
      <JsonEditor data={data.response} theme={jsonEditorTheme} viewOnly />
    </Box>
  );
};

export default ResponseViewer;
