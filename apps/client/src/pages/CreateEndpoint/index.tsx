import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { Link } from "react-router";
import Form from "./Form";

const BackButton = () => (
  <Button component={Link} to="/dashboard" startIcon={<ArrowBackIcon />}>
    Go back
  </Button>
);

const Headings = () => (
  <Box sx={{ mb: 4, mt: 2 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      New Endpoint
    </Typography>
    <Typography>
      Define a route and the shape of its response. Faker types are filled with
      fake data on every request.
    </Typography>
  </Box>
);

const CreateEndpoint = () => {
  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <BackButton />
      <Headings />
      <Form />
    </Container>
  );
};

export default CreateEndpoint;
