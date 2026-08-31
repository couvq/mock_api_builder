import { CircularProgress, List, ListItem, ListSubheader } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllEndpoints } from "../../api/endpoint";

const EndpointList = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["endpoints"],
    queryFn: getAllEndpoints,
  });

  if (isPending) return <CircularProgress />;
  if(isError) return error.message

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
