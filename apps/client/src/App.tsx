import AddEndpointPanel from "./components/add_endpoint_panel";
import DashboardLayout from "./components/dashboard_layout";
import EndpointViewer from "./components/endpoint_viewer";
import ResponseViewer from "./components/response_viewer";
import EditorContextProvider from "./context/EditorContext";
import TanstackQueryProvider from "./context/TanstackQueryProvider";

const App = () => {
  return (
    <>
      <TanstackQueryProvider>
        <EditorContextProvider>
          <DashboardLayout
            sidePanel={<AddEndpointPanel />}
            editorPanel={<EndpointViewer />}
            responsePanel={<ResponseViewer />}
          />
        </EditorContextProvider>
      </TanstackQueryProvider>
    </>
  );
};

export default App;
