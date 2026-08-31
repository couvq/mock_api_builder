import { Container, Paper, Stack } from "@mui/material";
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
      <Paper>{sidePanel}</Paper>
      <Stack direction="column" spacing={1}>
        <Paper>{editorPanel}</Paper>
        <Paper>{responsePanel}</Paper>
      </Stack>
    </Stack>
  );
};

export default DashboardLayout;
