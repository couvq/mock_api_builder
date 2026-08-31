import AddEndpointPanel from "./components/add_endpoint_panel";
import DashboardLayout from "./components/dashboard_layout";
import EndpointViewer from "./components/endpoint_viewer";
import ResponseViewer from "./components/response_viewer";
import TanstackQueryProvider from "./context/TanstackQueryProvider";

const App = () => {
  return (
    <>
      <TanstackQueryProvider>
        <DashboardLayout
          sidePanel={<AddEndpointPanel />}
          editorPanel={<EndpointViewer />}
          responsePanel={<ResponseViewer />}
        />
      </TanstackQueryProvider>
    </>
  );
};

export default App;
