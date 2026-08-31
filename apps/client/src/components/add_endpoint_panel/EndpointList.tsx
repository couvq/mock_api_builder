import {
  Box,
  List,
  ListItem,
  ListSubheader,
  Skeleton,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllEndpoints } from "../../api/endpoint";

const LoadingSkeleton = () => (
  <Stack direction="column" spacing={0.5}>
    {Array.from({ length: 5 }).map(() => (
      <Skeleton variant="rectangular" width={"100%"} height={20} />
    ))}
  </Stack>
);

const EndpointList = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["endpoints"],
    queryFn: getAllEndpoints,
  });

  if (isPending) return <LoadingSkeleton />;
  if (isError) return error.message;

  return (
    <List subheader={<ListSubheader>Mock endpoints</ListSubheader>}>
      {data.map((endpoint) => (
        <ListItem>
          {endpoint.method} {endpoint.path}
        </ListItem>
      ))}
    </List>
  );
};

export default EndpointList;
