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
    <Stack direction="row">
      <Box>{sidePanel}</Box>
      <Stack direction="column">
        <Box>{editorPanel}</Box>
        <Box>{responsePanel}</Box>
      </Stack>
    </Stack>
  );
};

export default DashboardLayout;
