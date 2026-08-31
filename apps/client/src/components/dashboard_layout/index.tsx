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
    <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
        <Paper>{sidePanel}</Paper>
        <Stack
          direction="column"
          spacing={1}
          sx={{ flex: 1, minWidth: 0, padding: 1.5 }}
        >
          <Paper sx={{ flex: 1, minHeight: 0, overflow: "auto", padding: 1 }}>
            {editorPanel}
          </Paper>
          <Paper sx={{ flex: 1, minHeight: 0, overflow: "auto", padding: 1 }}>
            {responsePanel}
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DashboardLayout;
