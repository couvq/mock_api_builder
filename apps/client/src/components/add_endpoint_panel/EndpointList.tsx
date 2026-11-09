import type { EndpointConfig } from "@mock-api-builder/schema/dist/dto/endpoint/config";
import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  useEditor,
  useEditorDispatch,
} from "../../context/Editor/EditorContext";
import { useEndpoints } from "../../hooks/endpoints";
import DeleteEndpointBtn from "./DeleteEndpointBtn";

const LoadingSkeleton = () => (
  <Stack
    direction="column"
    spacing={0.5}
    data-testid="endpoint-list-loading-skeleton"
  >
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} variant="rectangular" width={"100%"} height={20} />
    ))}
  </Stack>
);

const EndpointList = ({ filter }: { filter: string }) => {
  const { activeEndpointId } = useEditor();
  const [selectedEndpointId, setSelectedEndpointId] = useState<
    string | undefined
  >(activeEndpointId);
  const { isPending, isError, data, error } = useEndpoints();
  const dispatch = useEditorDispatch();
  let filteredData: EndpointConfig[] = [];
  if (data) {
    filteredData = data.filter((endpoint) =>
      endpoint.path.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  const handleListItemClick = (endpoint: EndpointConfig) => {
    setSelectedEndpointId(endpoint.id);
    dispatch({ type: "ADD_ENDPOINT", endpoint });
  };

  if (isPending) return <LoadingSkeleton />;
  if (isError) return error.message;

  return (
    <>
      <List
        subheader={<ListSubheader>Mock endpoints</ListSubheader>}
        sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}
      >
        {filteredData.map((endpoint) => (
          <ListItemButton
            key={endpoint.id}
            sx={{
              // Reveal the descendant button on hover, or when any descendant
              // (including the button itself) is focused, so keyboard users can
              // tab to the row and reach the now-visible delete button.
              "&:hover .hover-action-btn, &:focus-within .hover-action-btn": {
                opacity: 1,
                visibility: "visible",
              },
              // Touch devices have no hover, so keep the button always visible.
              "@media (hover: none)": {
                "& .hover-action-btn": {
                  opacity: 1,
                  visibility: "visible",
                },
              },
            }}
            selected={selectedEndpointId === endpoint.id}
            onClick={() => handleListItemClick(endpoint)}
          >
            <ListItemText
              primary={
                <>
                  <Typography>{endpoint.method}</Typography>
                  <Typography>/{endpoint.path}</Typography>
                </>
              }
            />
            <DeleteEndpointBtn endpointId={endpoint.id} />
          </ListItemButton>
        ))}
      </List>
      <Typography>
        {filteredData.length === 1
          ? "1 endpoint"
          : `${filteredData.length} endpoints`}
      </Typography>
    </>
  );
};

export default EndpointList;
