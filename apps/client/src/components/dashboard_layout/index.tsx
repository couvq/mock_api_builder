import { Box, Paper, Stack } from "@mui/material";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  sidePanel: ReactNode;
  editorPanel: ReactNode;
  responsePanel: ReactNode;
}

const DashboardLayout = ({
  sidePanel,
  editorPanel,
  responsePanel,
}: DashboardLayoutProps) => {
  return (
    <Box sx={{ maxHeight: "100vh", maxWidth: "100vw" }}>
        <Stack direction="row" spacing={1}>
          <Paper>{sidePanel}</Paper>
          <Stack direction="column" spacing={1} sx={{ width: "100%", padding: 1.5 }}>
            <Paper>{editorPanel}</Paper>
            <Paper>{responsePanel}</Paper>
          </Stack>
        </Stack>
    </Box>
  );
};

export default DashboardLayout;
