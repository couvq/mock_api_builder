import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

interface DashboardLayoutProps {
  sidePanel: ReactNode;
  editorPanel: ReactNode;
  responsePanel: ReactNode;
}

const ResizeHandle = styled(Separator)(({ theme }) => ({
  flexBasis: 6,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.divider,
  transition: theme.transitions.create("background-color", { duration: 120 }),
  "&:hover, &[data-separator='active'], &[data-separator='focus']": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const DashboardLayout = ({
  sidePanel,
  editorPanel,
  responsePanel,
}: DashboardLayoutProps) => {
  return (
    <Group orientation="horizontal" id="dashboard" style={{ gap: 3 }}>
      <Panel defaultSize="20%" minSize="15%">
        <Paper sx={{ height: "100%", overflow: "hidden" }}>{sidePanel}</Paper>
      </Panel>

      <ResizeHandle />

      <Panel minSize="30%">
        <Group orientation="vertical" style={{ gap: 3 }}>
          <Panel defaultSize="50%" minSize="20%">
            <Paper sx={{ height: "100%", overflow: "auto", p: 2 }}>
              {editorPanel}
            </Paper>
          </Panel>

          <ResizeHandle />

          <Panel defaultSize="50%" minSize="20%">
            <Paper sx={{ height: "100%", overflow: "auto", p: 2 }}>
              {responsePanel}
            </Paper>
          </Panel>
        </Group>
      </Panel>
    </Group>
  );
};

export default DashboardLayout;
