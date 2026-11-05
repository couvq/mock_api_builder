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
  const { error: toastError, success: toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const deleteEndpointMutation = useMutation({
    mutationFn: deleteEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toastSuccess("Endpoint deleted successfully.");
    },
    onError: () => {
      toastError("Failed to delete endpoint.");
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
          <ListItem key={endpoint.id}>
            <EndpointBtn endpoint={endpoint} />
            <IconButton
              aria-label={`Delete endpoint ${endpoint.id}`}
              size="small"
              onClick={() => handleDelete(endpoint.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Typography>{data.length} endpoints</Typography>
    </>
  );
};

export default EndpointList;
