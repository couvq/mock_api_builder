import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  EndpointConfig,
  transpile,
  type MockSchemaType,
  type TranspiledSchema,
} from "@mock-api-builder/schema";
import { JsonEditor } from "json-edit-react";
import { useState } from "react";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { Link } from "react-router";
import { MOCK_API_BASE_URL } from "../../../components/endpoint_viewer";
import {
  DEFAULT_FAKER_TYPE,
  FAKER_TYPE_SELECTION,
} from "../../../config/jsonEditor";
import { createEndpoint } from "../../../api/endpoint";
import { useToast } from "../../../hooks/toast";

// `EndpointConfig.method` only models these two, so the dropdown matches it.
const HTTP_METHODS = ["GET", "POST"] as const;

const METHOD_OPTIONS = HTTP_METHODS.map((method) => ({
  id: method,
  label: method,
}));

const DEFAULT_RESPONSE_SCHEMA: MockSchemaType = "";

type SchemaViewMode = "tree" | "json";

// Fills the json-edit-react card to its column height so the Response schema
// and Example response panels stay the same height.
const editorFillSx = {
  flexGrow: 1,
  minHeight: 0,
  "& .jer-editor-container": { height: "100%" },
};

const Form = () => {
  const [responseSchema, setResponseSchema] = useState<MockSchemaType>(
    DEFAULT_RESPONSE_SCHEMA,
  );
  const [viewMode, setViewMode] = useState<SchemaViewMode>("tree");
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [exampleResponse, setExampleResponse] = useState<TranspiledSchema>(() =>
    transpile(DEFAULT_RESPONSE_SCHEMA),
  );
  const { error, success } = useToast();

  // Response schema is the source of truth; refresh the preview wherever it
  // changes (rather than in an effect) so edits and regeneration stay in sync.
  const applyResponseSchema = (next: MockSchemaType) => {
    setResponseSchema(next);
    setExampleResponse(transpile(next));
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextMode: SchemaViewMode | null,
  ) => {
    // `exclusive` yields null when the active button is clicked; keep one on.
    if (!nextMode) return;
    if (nextMode === "json") {
      setJsonText(JSON.stringify(responseSchema, null, 2));
      setJsonError(null);
    }
    setViewMode(nextMode);
  };

  const handleJsonTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = event.target.value;
    setJsonText(text);
    try {
      applyResponseSchema(JSON.parse(text) as MockSchemaType);
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON");
    }
  };

  const handleRegenerate = () => {
    setExampleResponse(transpile(responseSchema));
  };

  const handleCreate = async (formData: {
    method: EndpointConfig["method"];
    path: EndpointConfig["path"];
  }) => {
    const payload: Omit<EndpointConfig, "id"> = {
      method: formData.method,
      path: formData.path,
      responseSchema,
    };

    try {
      const newEndpoint = await createEndpoint(payload);
      success(`Endpoint ${newEndpoint.id} created successfully!`);
    } catch {
      error("Failed to create endpoint. Please try again.");
    }
  };

  return (
    <FormContainer
      defaultValues={{ method: "GET", path: "" }}
      onSuccess={handleCreate}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 2 }}>
          <SelectElement
            name="method"
            label="Method"
            options={METHOD_OPTIONS}
            required
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 10 }}>
          <TextFieldElement
            name="path"
            label="Path"
            required
            fullWidth
            sx={{ "& input": { fontFamily: "monospace" } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {MOCK_API_BASE_URL}
                    </Typography>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Response schema</Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={viewMode}
              onChange={handleViewModeChange}
              aria-label="Response schema view"
            >
              <ToggleButton value="tree">Tree</ToggleButton>
              <ToggleButton value="json">Edit JSON</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={editorFillSx}>
            {viewMode === "tree" ? (
              <JsonEditor
                data={responseSchema}
                rootName="root"
                defaultValue={DEFAULT_FAKER_TYPE}
                restrictTypeSelection={FAKER_TYPE_SELECTION}
                onUpdate={(update) =>
                  applyResponseSchema(update.newData as MockSchemaType)
                }
              />
            ) : (
              <TextField
                fullWidth
                multiline
                minRows={10}
                value={jsonText}
                onChange={handleJsonTextChange}
                error={Boolean(jsonError)}
                helperText={jsonError ?? " "}
                sx={{
                  height: "100%",
                  "& .MuiInputBase-root": {
                    height: "100%",
                    alignItems: "flex-start",
                  },
                }}
                slotProps={{
                  htmlInput: {
                    "aria-label": "responseSchemaEditor",
                    style: { fontFamily: "monospace" },
                  },
                }}
              />
            )}
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Example response</Typography>
            <Button size="small" onClick={handleRegenerate}>
              Regenerate
            </Button>
          </Box>
          <Box sx={editorFillSx} role="region" aria-label="Example response">
            <JsonEditor data={exampleResponse} viewOnly rootName="root" />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/dashboard">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create endpoint
          </Button>
        </Stack>
      </Box>
    </FormContainer>
  );
};

export default Form;
