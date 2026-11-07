import AddEndpointPanel from "../../components/add_endpoint_panel";
import ThemeToggle from "../../components/common/ThemeToggle";
import DashboardLayout from "../../components/dashboard_layout";
import EndpointViewer from "../../components/endpoint_viewer";
import ResponseViewer from "../../components/response_viewer";

const Dashboard = () => {
  return (
    <>
      <ThemeToggle />
      <DashboardLayout
        sidePanel={<AddEndpointPanel />}
        editorPanel={<EndpointViewer />}
        responsePanel={<ResponseViewer />}
      />
    </>
  );
};

export default Dashboard;
