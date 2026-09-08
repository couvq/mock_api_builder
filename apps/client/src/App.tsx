import AddEndpointPanel from "./components/add_endpoint_panel";
import DashboardLayout from "./components/dashboard_layout";
import EndpointViewer from "./components/endpoint_viewer";
import ResponseViewer from "./components/response_viewer";
import EditorContextProvider from "./context/EditorContext";
import MockRequestProvider from "./context/MockRequestProvider";
import TanstackQueryProvider from "./context/TanstackQueryProvider";
import ToastProvider from "./context/ToastProvider";

const App = () => {
  return (
    <>
      <TanstackQueryProvider>
        <ToastProvider>
          <EditorContextProvider>
            <MockRequestProvider>
              <DashboardLayout
                sidePanel={<AddEndpointPanel />}
                editorPanel={<EndpointViewer />}
                responsePanel={<ResponseViewer />}
              />
            </MockRequestProvider>
          </EditorContextProvider>
        </ToastProvider>
      </TanstackQueryProvider>
    </>
  );
};

export default App;
