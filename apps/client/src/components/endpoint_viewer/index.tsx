import {
  type EndpointConfig,
  type MockSchemaType,
} from "@mock-api-builder/schema";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JsonEditor } from "json-edit-react";
import { isEqual } from "lodash";
import { updateEndpoint } from "../../api/endpoint";
import {
  useEditor,
  useEditorDispatch,
} from "../../context/Editor/EditorContext";
import { useMockRequest } from "../../context/MockRequest/MockRequestProvider";
import { useEndpoints } from "../../hooks/endpoints";
import { useJsonEditorTheme } from "../../hooks/jsonEditorTheme";
import { useToast } from "../../hooks/toast";
import {
  DEFAULT_FAKER_TYPE,
  FAKER_TYPE_SELECTION,
} from "../../config/jsonEditor";

export const MOCK_API_BASE_URL = "http://localhost:3000/v1/api/mock_api/";

const EndpointViewer = () => {
  const toast = useToast();
  const { activeEndpointId, draft } = useEditor();
  const dispatch = useEditorDispatch();
  const { isSuccess, data } = useEndpoints();
  const queryClient = useQueryClient();
  const updateEndpointMutation = useMutation({
    mutationFn: updateEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast.success("Endpoint saved successfully.");
    },
  });
  const serveMockRequestMutation = useMockRequest();
  const jsonEditorTheme = useJsonEditorTheme();

  if (!activeEndpointId || !draft) return "No endpoint selected.";

  const { id, method, path, responseSchema } = draft;

  const matchesServerData =
    isSuccess &&
    isEqual(
      data.find((value) => value.id === id),
      draft,
    );
  const isEditing = !matchesServerData;

  const updateDraft = (changes: Partial<EndpointConfig>) => {
    dispatch({ type: "UPDATE_DRAFT", draft: { ...draft, ...changes } });
  };

  const handleSave = () => {
    updateEndpointMutation.mutate(draft);
  };

  const handleSend = () => {
    serveMockRequestMutation.mutate({ method, path });
  };

  return (
    <Box data-testid="endpoint-viewer">
      <Stack direction="column">
        <Stack direction="row" spacing={4}>
          <TextField
            fullWidth
            label="Endpoint"
            value={path}
            onChange={(e) => updateDraft({ path: e.target.value })}
            slotProps={{
              input: {
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <Select
                        value={method}
                        onChange={(e) =>
                          updateDraft({ method: e.target.value })
                        }
                        variant="standard"
                        disableUnderline
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                      </Select>
                    </InputAdornment>
                    {MOCK_API_BASE_URL}
                  </>
                ),
              },
            }}
          />

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleSave}
              loading={updateEndpointMutation.isPending}
            >
              Save
            </Button>
            {isEditing ? (
              <Tooltip
                describeChild
                title="Cannot send mock requests while editing."
              >
                <span style={{ display: "flex" }}>
                  <Button variant="contained" disabled>
                    Send
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                onClick={handleSend}
                loading={serveMockRequestMutation.isPending}
              >
                Send
              </Button>
            )}
          </Stack>
        </Stack>
        <Box>
          <Typography>Response schema</Typography>
          <JsonEditor
            data={responseSchema}
            theme={jsonEditorTheme}
            defaultValue={DEFAULT_FAKER_TYPE}
            restrictTypeSelection={FAKER_TYPE_SELECTION}
            onUpdate={(newSchema) =>
              updateDraft({
                responseSchema: newSchema.newData as MockSchemaType,
              })
            }
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default EndpointViewer;
