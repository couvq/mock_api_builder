import { Box } from "@mui/material";
import AddEndpointPanel from "../../components/add_endpoint_panel";
import ThemeToggle from "../../components/common/ThemeToggle";
import DashboardLayout from "../../components/dashboard_layout";
import EndpointViewer from "../../components/endpoint_viewer";
import ResponseViewer from "../../components/response_viewer";

const Dashboard = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ThemeToggle />
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DashboardLayout
          sidePanel={<AddEndpointPanel />}
          editorPanel={<EndpointViewer />}
          responsePanel={<ResponseViewer />}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
