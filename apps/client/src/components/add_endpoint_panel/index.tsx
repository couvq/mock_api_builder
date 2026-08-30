import type { EndpointConfig } from "@mock-api-builder/schema";
import {
  Button,
  Container,
  List,
  ListItem,
  ListSubheader,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const dummyEndpoints: EndpointConfig[] = [
  {
    id: "0",
    method: "GET",
    path: "/users",
    responseSchema: {},
  },
  {
    id: "1",
    method: "GET",
    path: "/posts",
    responseSchema: {},
  },
  {
    id: "2",
    method: "GET",
    path: "/likes",
    responseSchema: {},
  },
];

const AddEndpointPanel = () => {
  return (
    <Container>
      <Stack direction='column'>
        <Button variant="contained" startIcon={<AddIcon />}>
          New endpoint
        </Button>
        <TextField placeholder="Search endpoints" />
        <List subheader={<ListSubheader>Endpoints</ListSubheader>}>
          {dummyEndpoints.map((dummyEndpoint) => (
            <ListItem>
              {dummyEndpoint.method} {dummyEndpoint.path}
            </ListItem>
          ))}
        </List>
      </Stack>
    </Container>
  );
};

export default AddEndpointPanel;
