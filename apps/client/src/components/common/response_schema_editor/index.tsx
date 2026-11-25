import {
  transpile,
  type MockSchemaType,
  type TranspiledSchema,
} from "@mock-api-builder/schema";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import SchemaEditor from "../schema_editor";
import TreeEditor from "../tree_editor";

// Floors the example response so the two panels stay the same height and never
// collapse too small; the editable schema (SchemaEditor) fills to match.
const exampleFillSx = {
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
 * `value`/`onChange`; the generated preview is local. Reused by both the
 * create and edit endpoint pages.
 */
const ResponseSchemaEditor = ({
  value,
  onChange,
}: ResponseSchemaEditorProps) => {
  const [exampleResponse, setExampleResponse] = useState<TranspiledSchema>(() =>
    transpile(value),
  );

  const applyResponseSchema = (next: MockSchemaType) => {
    onChange(next);
    setExampleResponse(transpile(next));
  };

  const handleRegenerate = () => setExampleResponse(transpile(value));

  return (
    <Grid container spacing={4} sx={{ mt: 2 }}>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <SchemaEditor value={value} onChange={applyResponseSchema} />
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
        <Box sx={exampleFillSx} role="region" aria-label="Example response">
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
