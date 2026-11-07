import { Container, Stack, TextField } from "@mui/material";
import AddEndpointBtn from "./AddEndpointBtn";
import EndpointList from "./EndpointList";
import { useState } from "react";

const AddEndpointPanel = () => {
  const [filter, setFilter] = useState("");

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
        <TextField
          placeholder="Search endpoints"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <EndpointList filter={filter} />
      </Stack>
    </Container>
  );
};

export default AddEndpointPanel;
