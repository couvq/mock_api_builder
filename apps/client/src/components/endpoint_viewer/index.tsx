import { useEditor } from "../../context/EditorContext";

const EndpointViewer = () => {
  const { activeEndpointId, draft } = useEditor();

  return <>{activeEndpointId}{" "}{JSON.stringify(draft)}</>;
};

export default EndpointViewer;
