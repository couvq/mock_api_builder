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
        height: "100%",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack direction="column" sx={{ height: "100%", minHeight: 0 }}>
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
