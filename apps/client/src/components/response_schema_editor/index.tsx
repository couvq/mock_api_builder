import {
  transpile,
  type MockSchemaType,
  type TranspiledSchema,
} from "@mock-api-builder/schema";
import {
  Box,
  Button,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { JsonEditor } from "json-edit-react";
import { useState } from "react";
import {
  DEFAULT_FAKER_TYPE,
  FAKER_TYPE_SELECTION,
} from "../../config/jsonEditor";
import { useJsonEditorTheme } from "../../hooks/jsonEditorTheme";

type SchemaViewMode = "tree" | "json";

// Fills the json-edit-react card to its column height so the Response schema
// and Example response panels stay the same height.
const editorFillSx = {
  flexGrow: 1,
  minHeight: 0,
  "& .jer-editor-container": { height: "100%" },
};

interface ResponseSchemaEditorProps {
  value: MockSchemaType;
  onChange: (next: MockSchemaType) => void;
}

/**
 * Shared editor for an endpoint's response schema plus a live "example
 * response" preview. The schema is controlled by the parent via
 * `value`/`onChange`; the view mode, raw-JSON text, and generated preview are
 * local. Reused by both the create and edit endpoint pages.
 */
const ResponseSchemaEditor = ({
  value,
  onChange,
}: ResponseSchemaEditorProps) => {
  const [viewMode, setViewMode] = useState<SchemaViewMode>("tree");
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(value, null, 2),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [exampleResponse, setExampleResponse] = useState<TranspiledSchema>(() =>
    transpile(value),
  );
  const jsonEditorTheme = useJsonEditorTheme();

  // Schema is the source of truth; refresh the preview wherever it changes
  // (rather than in an effect) so edits and regeneration stay in sync.
  const applyResponseSchema = (next: MockSchemaType) => {
    onChange(next);
    setExampleResponse(transpile(next));
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextMode: SchemaViewMode | null,
  ) => {
    // `exclusive` yields null when the active button is clicked; keep one on.
    if (!nextMode) return;
    if (nextMode === "json") {
      setJsonText(JSON.stringify(value, null, 2));
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
    setExampleResponse(transpile(value));
  };

  return (
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
              data={value}
              theme={jsonEditorTheme}
              rootName="root"
              collapse
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
          <JsonEditor
            data={exampleResponse}
            theme={jsonEditorTheme}
            viewOnly
            collapse
            rootName="root"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResponseSchemaEditor;
