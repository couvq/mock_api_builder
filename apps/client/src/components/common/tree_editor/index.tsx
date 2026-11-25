import { JsonEditor, type JsonEditorProps } from "json-edit-react";
import { useJsonEditorTheme } from "../../../hooks/jsonEditorTheme";

type TreeEditorProps = Omit<JsonEditorProps, "theme">;

const TreeEditor = (props: TreeEditorProps) => {
  const theme = useJsonEditorTheme();

  return <JsonEditor theme={theme} {...props} />;
};

export default TreeEditor;
