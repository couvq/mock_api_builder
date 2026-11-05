import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  List,
  ListItem,
  ListSubheader,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEndpoints } from "../../hooks/endpoints";
import EndpointBtn from "./EndpointBtn";
import { deleteEndpoint } from "../../api/endpoint";
import { useToast } from "../../hooks/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

const EndpointList = () => {
  const { isPending, isError, data, error } = useEndpoints();
  const toast = useToast();
  const queryClient = useQueryClient();
  const deleteEndpointMutation = useMutation({
    mutationFn: deleteEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast.success("Endpoint deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete endpoint.");
    },
  });

  if (isPending) return <LoadingSkeleton />;
  if (isError) return error.message;

  const handleDelete = (endpointId: string) => {
    deleteEndpointMutation.mutate(endpointId);
  };

  return (
    <>
      <List subheader={<ListSubheader>Mock endpoints</ListSubheader>}>
        {data.map((endpoint) => (
          <ListItem
            key={endpoint.id}
            sx={{
              // Target the descendant button when this specific ListItem is hovered
              "&:hover .hover-action-btn": {
                opacity: 1,
                visibility: "visible",
              },
            }}
          >
            <EndpointBtn endpoint={endpoint} />

            <IconButton
              className="hover-action-btn"
              aria-label="delete"
              size="small"
              color="error"
              sx={{
                opacity: 0,
                visibility: "hidden",
                // Reserves consistent space so the text never jumps or moves when the button appears
                marginLeft: "auto",
                transition: "opacity 0.15s ease, visibility 0.15s ease",
              }}
              onClick={() => handleDelete(endpoint.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Typography>{data.length} endpoints</Typography>
    </>
  );
};

export default EndpointList;
