import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import { Link, useSearchParams } from "react-router";
import { useEndpoint } from "../../hooks/endpoints";
import Form from "./Form";

const BackButton = () => (
  <Button component={Link} to="/dashboard" startIcon={<ArrowBackIcon />}>
    Go back
  </Button>
);

const Headings = () => (
  <Box sx={{ mb: 4, mt: 2 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Edit Endpoint
    </Typography>
    <Typography>
      Update the route or the shape of its response. Faker types are filled with
      fake data on every request.
    </Typography>
  </Box>
);

const EditEndpoint = () => {
  const [searchParams] = useSearchParams();
  const endpointId = searchParams.get("endpointId") ?? undefined;
  const { data, isPending, isError, error, isFetchedAfterMount } =
    useEndpoint(endpointId);

  const renderBody = () => {
    if (!endpointId) {
      return (
        <Alert severity="warning">
          No endpoint selected. Provide an endpointId query parameter.
        </Alert>
      );
    }
    if (isError) {
      return <Alert severity="error">{error.message}</Alert>;
    }
    // Cached data may be stale (e.g. edited elsewhere). Wait for the refetch on
    // mount so the form, which seeds its state once, starts from fresh values.
    if (isPending || !isFetchedAfterMount) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress aria-label="Loading endpoint" />
        </Box>
      );
    }
    return <Form endpoint={data} />;
  };

  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <BackButton />
      <Headings />
      {renderBody()}
    </Container>
  );
};

export default EditEndpoint;
