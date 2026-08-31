import type { EndpointConfig } from "@mock-api-builder/schema";
import { Button } from "@mui/material";
import { useEditorDispatch } from "../../context/EditorContext";

interface EndpointBtnProps {
  endpoint: EndpointConfig;
}

const EndpointBtn = ({ endpoint }: EndpointBtnProps) => {
  const dispatch = useEditorDispatch();

  const handleClick = () => {
    dispatch({ type: "ADD_ENDPOINT", endpoint });
  };

  return (
    <Button onClick={handleClick}>
      {endpoint.method} {endpoint.path}
    </Button>
  );
};

export default EndpointBtn;
