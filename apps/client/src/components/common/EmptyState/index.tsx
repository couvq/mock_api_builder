import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const EmptyState = ({ icon, title, description }: EmptyStateProps) => (
  <Box
    sx={{
      height: "100%",
      minHeight: 220,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Stack
      spacing={1.25}
      sx={{ alignItems: "center", textAlign: "center", maxWidth: 440, px: 2 }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          mb: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          color: "primary.main",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
          "& svg": { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
  </Box>
);

export default EmptyState;
