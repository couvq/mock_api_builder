import { Container, Stack, TextField } from "@mui/material";
import AddEndpointBtn from "./AddEndpointBtn";
import EndpointList from "./EndpointList";

const AddEndpointPanel = () => {
  return (
    <Container
      sx={{
        minWidth: "25vw",
        height: "100vh",
        padding: 2,
      }}
    >
      <Stack direction="column">
        <AddEndpointBtn />
        <br />
        <TextField placeholder="Search endpoints" />
        <EndpointList />
      </Stack>
    </Container>
  );
};

export default AddEndpointPanel;
