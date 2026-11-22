import { Box, Button, Container, Typography } from "@mui/material";
import { Link, useLocation } from "react-router";

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Page not found
        </Typography>
        <Typography color="text.secondary">
          There's no page at{" "}
          <Box
            component="code"
            sx={{
              fontFamily: "monospace",
              fontSize: 13,
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              bgcolor: "action.hover",
              wordBreak: "break-all",
            }}
          >
            {pathname}
          </Box>
          .
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          sx={{ mt: 1 }}
        >
          Go to dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
