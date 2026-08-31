import type { EndpointConfig } from "@mock-api-builder/schema";
import { Button } from "@mui/material";

interface EndpointBtnProps {
  endpoint: EndpointConfig;
}

const EndpointBtn = ({ endpoint }: EndpointBtnProps) => {
  return (
    <Button variant='outlined'>
      {endpoint.method} {endpoint.path}
    </Button>
  );
};

export default EndpointBtn;
