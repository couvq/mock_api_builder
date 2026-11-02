import { Button, Card, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { Link } from "react-router";

const BackButton = () => {
  return (
    <Link to="/dashboard">
      <Button>Go back</Button>
    </Link>
  );
};

const CreateEndpoint = () => {
  return (
    <Container>
      <BackButton />
      <Typography variant="h4" component="h1" gutterBottom>
        New Endpoint
      </Typography>
      <Typography>
        Define a route and the shape of its response. Faker types are filled
        with fake data on every request.
      </Typography>
      <Card>todo</Card>
    </Container>
  );
};

export default CreateEndpoint;
