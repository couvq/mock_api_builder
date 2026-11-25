import {
  transpile,
  type MockSchemaType,
  type TranspiledSchema,
} from "@mock-api-builder/schema";
import {
  Box,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  DEFAULT_FAKER_TYPE,
  FAKER_TYPE_SELECTION,
} from "../../../config/jsonEditor";
import JsonCodeEditor from "../json_code_editor";
import TreeEditor from "../tree_editor";

type SchemaViewMode = "tree" | "json";

// Fills the editor to its column height so the Response schema and Example
// response panels stay the same height, with a floor so they never collapse
// too small when the schema is short.
const editorFillSx = {
  flexGrow: 1,
  minHeight: 300,
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
  const [exampleResponse, setExampleResponse] = useState<TranspiledSchema>(() =>
    transpile(value),
  );

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
    setViewMode(nextMode);
  };

  const handleRegenerate = () => setExampleResponse(transpile(value));

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
            <TreeEditor
              data={value}
              rootName="root"
              collapse={1}
              defaultValue={DEFAULT_FAKER_TYPE}
              restrictTypeSelection={FAKER_TYPE_SELECTION}
              onUpdate={(update) =>
                applyResponseSchema(update.newData as MockSchemaType)
              }
            />
          ) : (
            <JsonCodeEditor
              value={value}
              onChange={applyResponseSchema}
              label="responseSchemaEditor"
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
          <TreeEditor
            data={exampleResponse}
            viewOnly
            collapse={1}
            rootName="root"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResponseSchemaEditor;
