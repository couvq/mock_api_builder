import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { JsonEditor } from "json-edit-react";
import { useEditor, useEditorDispatch } from "../../context/EditorContext";

const EndpointViewer = () => {
  const { activeEndpointId, draft } = useEditor();
  const dispatch = useEditorDispatch();

  if (!activeEndpointId || !draft) return "No endpoint selected.";

  const { id, method, path, responseSchema } = draft;

  const handleMethodChange = (e) => {
    dispatch({
      type: "UPDATE_DRAFT",
      draft: { ...draft, method: e.target.value },
    });
  };

  const handlePathChange = (e) => {
    dispatch({
      type: "UPDATE_DRAFT",
      draft: { ...draft, path: e.target.value },
    });
  };

  const handleResponseSchemaChange = (newSchema) => {
    dispatch({
      type: "UPDATE_DRAFT",
      draft: { ...draft, responseSchema: newSchema },
    });
  };

  return (
    <Box>
      <Stack direction="column">
        <Stack direction="row" spacing={4}>
          <TextField
            fullWidth
            label="Endpoint"
            value={path}
            onChange={handlePathChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Select
                      value={method}
                      onChange={handleMethodChange}
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
            <Button variant="outlined">Save</Button>
            <Button variant="contained">Send</Button>
          </Stack>
        </Stack>
        <Box>
          <JsonEditor
            data={responseSchema}
            onUpdate={(newSchema) => handleResponseSchemaChange(newSchema.newData)}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default EndpointViewer;
