import { transpile } from "@mock-api-builder/schema";
import { useEditor } from "../../context/EditorContext";
import { Box } from "@mui/material";

const ResponseViewer = () => {
  const { draft } = useEditor();

  if (!draft) return "No endpoint selected.";

  const { responseSchema } = draft;
  const generatedResponse = transpile(responseSchema);

  return <Box>{JSON.stringify(generatedResponse)}</Box>;
};

export default ResponseViewer;
