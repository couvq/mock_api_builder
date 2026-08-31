import AddIcon from "@mui/icons-material/Add";
import {
    Button,
    Container,
    Stack,
    TextField
} from "@mui/material";
import EndpointList from "./EndpointList";

const AddEndpointPanel = () => {
  return (
    <Container sx={{
      minWidth: '25vw',
      height: '100vh',
      padding: 2
    }}>
      <Stack direction="column">
        <Button variant="contained" startIcon={<AddIcon />}>
          New endpoint
        </Button>
        <br />
        <TextField placeholder="Search endpoints" />
        <EndpointList />
      </Stack>
    </Container>
  );
};

export default AddEndpointPanel;
