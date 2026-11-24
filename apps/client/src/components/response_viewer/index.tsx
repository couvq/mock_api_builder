import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useMockRequest } from "../../context/MockRequest/MockRequestProvider";
import { JsonEditor } from "json-edit-react";
import { useJsonEditorTheme } from "../../hooks/jsonEditorTheme";
import { MOCK_API_BASE_URL } from "../endpoint_viewer";
import { MockRequestError } from "../../api/mock_api";
import EmptyState from "../common/EmptyState";

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
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", mb: 1.5 }}
        >
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
    return (
      <EmptyState
        icon={<SendIcon />}
        title="Send a request to see the response"
        description="Faker types in the schema are replaced with fresh fake data on every request."
      />
    );

  return (
    <Box data-testid="response-json-viewer">
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 1.5 }}>
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
