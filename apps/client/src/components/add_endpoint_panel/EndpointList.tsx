import {
  List,
  ListItem,
  ListSubheader,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEndpoints } from "../../hooks/endpoints";
import EndpointBtn from "./EndpointBtn";

const LoadingSkeleton = () => (
  <Stack direction="column" spacing={0.5}>
    {Array.from({ length: 5 }).map(() => (
      <Skeleton variant="rectangular" width={"100%"} height={20} />
    ))}
  </Stack>
);

const EndpointList = () => {
  const { isPending, isError, data, error } = useEndpoints();

  if (isPending) return <LoadingSkeleton />;
  if (isError) return error.message;

  return (
    <>
      <List subheader={<ListSubheader>Mock endpoints</ListSubheader>}>
        {data.map((endpoint) => (
          <ListItem>
            <EndpointBtn endpoint={endpoint} />
          </ListItem>
        ))}
      </List>
      <Typography>{data.length} endpoints</Typography>
    </>
  );
};

export default EndpointList;
