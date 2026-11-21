import type { EndpointConfig } from "@mock-api-builder/schema/dist/dto/endpoint/config";
import {
  List,
  ListItem,
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
import ConfirmDeletionModal from "./ConfirmDeletionModal";
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
  const { isPending, isError, data, error } = useEndpoints();
  const dispatch = useEditorDispatch();
  // The delete confirmation modal is rendered once, outside the list rows, so
  // its events never bubble through the React tree into a ListItemButton.
  const [pendingDeleteEndpoint, setPendingDeleteEndpoint] =
    useState<EndpointConfig | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  let filteredData: EndpointConfig[] = [];
  if (data) {
    filteredData = data.filter((endpoint) =>
      endpoint.path.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  const handleListItemClick = (endpoint: EndpointConfig) =>
    dispatch({ type: "ADD_ENDPOINT", endpoint });

  const openDeleteModal = (endpoint: EndpointConfig) => {
    setPendingDeleteEndpoint(endpoint);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  if (isPending) return <LoadingSkeleton />;
  if (isError) return error.message;

  return (
    <>
      <List
        subheader={<ListSubheader>Mock endpoints</ListSubheader>}
        sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}
      >
        {filteredData.map((endpoint) => (
          <ListItem
            key={endpoint.id}
            disablePadding
            secondaryAction={
              <DeleteEndpointBtn onClick={() => openDeleteModal(endpoint)} />
            }
            sx={{
              // Reveal the delete button on hover, or when any descendant (the
              // row button or the delete button) is focused, so keyboard users
              // can tab to the row and reach the now-visible delete button.
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
          >
            <ListItemButton
              selected={activeEndpointId === endpoint.id}
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
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Typography>
        {filteredData.length === 1
          ? "1 endpoint"
          : `${filteredData.length} endpoints`}
      </Typography>
      {pendingDeleteEndpoint && (
        <ConfirmDeletionModal
          isOpen={isDeleteModalOpen}
          endpoint={pendingDeleteEndpoint}
          onClose={closeDeleteModal}
        />
      )}
    </>
  );
};

export default EndpointList;
