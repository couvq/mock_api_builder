import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEditor } from "../../context/EditorContext";

const EndpointViewer = () => {
  const { activeEndpointId, draft } = useEditor();

  if (!activeEndpointId || !draft) return "No endpoint selected.";

  const { id, method, path, responseSchema } = draft;

  return (
    <Box>
      <Stack direction="column">
        <Stack direction="row">
          <TextField
            fullWidth
            label="Endpoint"
            value={path}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Select value={method} variant="standard" disableUnderline>
                      <MenuItem value="GET">GET</MenuItem>
                    </Select>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack direction="row">
            <Button variant="outlined">Save</Button>
            <Button variant="contained">Send</Button>
          </Stack>
        </Stack>
        <Box>{JSON.stringify(responseSchema)}</Box>
      </Stack>
    </Box>
  );
};

export default EndpointViewer;
