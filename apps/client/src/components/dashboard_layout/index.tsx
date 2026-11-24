import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

interface DashboardLayoutProps {
  sidePanel: ReactNode;
  editorPanel: ReactNode;
  responsePanel: ReactNode;
}

// A thin visible sash with a generous (invisible) grab zone, VS Code-style, so
// it's easy to grab without a chunky divider — larger for touch than mouse.
const RESIZE_HIT_TARGET = { coarse: 16, fine: 12 };

const ResizeHandle = styled(Separator)(({ theme }) => ({
  // The library sets `flex: 0 0 auto` inline, which would collapse the sash to
  // 0px; `!important` is needed to give it a visible thickness.
  flexBasis: "6px !important",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.divider,
  transition: theme.transitions.create("background-color", {
    duration: theme.transitions.duration.shortest,
  }),
  // Light up in the accent colour while hovering/dragging/focused so the
  // resize affordance is obvious (the library supplies the resize cursor).
  "&:hover, &[data-separator='active'], &[data-separator='focus']": {
    backgroundColor: theme.palette.primary.main,
  },
}));

// Flat, clearly bordered panels (VS Code-style) so each region is distinct.
const panelPaperSx = {
  height: "100%",
  borderColor: "divider",
} as const;

const DashboardLayout = ({
  sidePanel,
  editorPanel,
  responsePanel,
}: DashboardLayoutProps) => {
  return (
    <Group
      orientation="horizontal"
      id="dashboard"
      style={{ gap: 2 }}
      resizeTargetMinimumSize={RESIZE_HIT_TARGET}
    >
      <Panel defaultSize="20%" minSize="15%">
        <Paper variant="outlined" sx={{ ...panelPaperSx, overflow: "hidden" }}>
          {sidePanel}
        </Paper>
      </Panel>

      <ResizeHandle />

      <Panel minSize="30%">
        <Group
          orientation="vertical"
          style={{ gap: 2 }}
          resizeTargetMinimumSize={RESIZE_HIT_TARGET}
        >
          <Panel defaultSize="50%" minSize="20%">
            <Paper
              variant="outlined"
              sx={{ ...panelPaperSx, overflow: "auto", p: 2 }}
            >
              {editorPanel}
            </Paper>
          </Panel>

          <ResizeHandle />

          <Panel defaultSize="50%" minSize="20%">
            <Paper
              variant="outlined"
              sx={{ ...panelPaperSx, overflow: "auto", p: 2 }}
            >
              {responsePanel}
            </Paper>
          </Panel>
        </Group>
      </Panel>
    </Group>
  );
};

export default DashboardLayout;
