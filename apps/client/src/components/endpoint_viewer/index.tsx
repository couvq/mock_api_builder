import {
  FakerSchema,
  transpile,
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
import { JsonEditor } from "json-edit-react";
import { useEditor, useEditorDispatch } from "../../context/EditorContext";
import { useEndpoints } from "../../hooks/endpoints";
import { isEqual } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { updateEndpoint } from "../../api/endpoint";
import { useToast } from "../../hooks/toast";
import { useMockRequest } from "../../context/MockRequestProvider";

const EndpointViewer = () => {
  const toast = useToast();
  const { activeEndpointId, draft } = useEditor();
  const dispatch = useEditorDispatch();
  const { isSuccess, data } = useEndpoints();
  const updateEndpointMutation = useMutation({
    mutationFn: updateEndpoint,
    onSuccess: () => toast.success("Endpoint saved successfully."),
  });
  const serveMockRequestMutation = useMockRequest();

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
    // TODO: strongly type my context
    // @ts-ignore
    serveMockRequestMutation.mutate({ method, path });
  };

  return (
    <Box>
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
                  <InputAdornment position="start">
                    <Select
                      value={method}
                      onChange={(e) => updateDraft({ method: e.target.value })}
                      variant="standard"
                      disableUnderline
                    >
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                    </Select>
                  </InputAdornment>
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
              <Button variant="contained" onClick={handleSend}>Send</Button>
            )}
          </Stack>
        </Stack>
        <Box>
          <Typography>Response schema</Typography>
          <JsonEditor
            data={responseSchema}
            defaultValue={FakerSchema.options[0]}
            restrictTypeSelection={[
              "object",
              "array",
              {
                enum: "Faker Type",
                values: FakerSchema.options,
                matchPriority: 1,
              },
            ]}
            onUpdate={(newSchema) =>
              updateDraft({
                responseSchema: newSchema.newData as MockSchemaType,
              })
            }
          />
        </Box>
        <Box>
          <Typography>Generated response</Typography>
          <JsonEditor data={transpile(responseSchema)} viewOnly />
        </Box>
      </Stack>
    </Box>
  );
};

export default EndpointViewer;
