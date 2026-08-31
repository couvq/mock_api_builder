import { Box, Stack } from "@mui/material";
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
    <Stack direction="row" spacing={1}>
      <Box>{sidePanel}</Box>
      <Stack direction="column" spacing={1}>
        <Box>{editorPanel}</Box>
        <Box>{responsePanel}</Box>
      </Stack>
    </Stack>
  );
};

export default DashboardLayout;
