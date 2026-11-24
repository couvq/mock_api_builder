import { Paper } from "@mui/material";
import { alpha, styled, type Theme } from "@mui/material/styles";
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
  // 0px; `!important` is needed to give it a visible thickness. Kept to a thin
  // 2px line (the grab target is widened separately via resizeTargetMinimumSize).
  flexBasis: "2px !important",
  // Transparent at rest (the panels' own borders divide them); the sash only
  // shows up in the accent colour while hovering/dragging/focused.
  backgroundColor: "transparent",
  transition: theme.transitions.create("background-color", {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover, &[data-separator='active'], &[data-separator='focus']": {
    backgroundColor: theme.palette.primary.main,
  },
}));

// Flat panels with a faint outline — subtle enough to just hint at each
// region's bounds rather than box it in.
const panelPaperSx = {
  height: "100%",
  borderColor: (theme: Theme) => alpha(theme.palette.divider, 0.06),
};

const DashboardLayout = ({
  sidePanel,
  editorPanel,
  responsePanel,
}: DashboardLayoutProps) => {
  return (
    <Group
      orientation="horizontal"
      id="dashboard"
      style={{ gap: 0 }}
      resizeTargetMinimumSize={RESIZE_HIT_TARGET}
    >
      <Panel defaultSize="25%" minSize="20%">
        <Paper variant="outlined" sx={{ ...panelPaperSx, overflow: "hidden" }}>
          {sidePanel}
        </Paper>
      </Panel>

      <ResizeHandle />

      <Panel minSize="30%">
        <Group
          orientation="vertical"
          style={{ gap: 0 }}
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
