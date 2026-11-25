import { type MockSchemaType } from "@mock-api-builder/schema";
import {
  Box,
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

// Fills the editor body to the component's height (so Monaco can size itself)
// and scrolls long trees; `.jer-editor-container` is json-edit-react's root.
// The tree root takes `minHeight` (not `height`) so its background grows with
// a long schema: pinned to `height: 100%` the container's background stopped at
// the viewport, so rows past it scrolled onto the bare page background.
// `minHeight: 100%` still fills the box when the schema is short.
const editorFillSx = {
  flexGrow: 1,
  minHeight: 0,
  overflow: "auto",
  "& .jer-editor-container": { minHeight: "100%" },
};

interface SchemaEditorProps {
  value: MockSchemaType;
  onChange: (next: MockSchemaType) => void;
}

/**
 * Editable response-schema control with a Tree / Edit JSON toggle: a
 * json-edit-react tree for guided editing, or a Monaco JSON editor for raw
 * edits (with faker-type autocomplete). Controlled via `value`/`onChange`; the
 * active view mode is local. Grows to fill a flex-column parent.
 */
const SchemaEditor = ({ value, onChange }: SchemaEditorProps) => {
  const [viewMode, setViewMode] = useState<SchemaViewMode>("tree");

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextMode: SchemaViewMode | null,
  ) => {
    // `exclusive` yields null when the active button is clicked; keep one on.
    if (!nextMode) return;
    setViewMode(nextMode);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
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
            // json-edit-react caps width at ~600px by default, which leaves the
            // toggle stranded far to its right in a wide panel; fill instead.
            maxWidth="100%"
            defaultValue={DEFAULT_FAKER_TYPE}
            restrictTypeSelection={FAKER_TYPE_SELECTION}
            onUpdate={(update) => onChange(update.newData as MockSchemaType)}
          />
        ) : (
          <JsonCodeEditor
            value={value}
            onChange={onChange}
            label="responseSchemaEditor"
          />
        )}
      </Box>
    </Box>
  );
};

export default SchemaEditor;
