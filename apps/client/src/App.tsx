import AddEndpointPanel from "./components/add_endpoint_panel";
import EndpointViewer from "./components/endpoint_viewer";
import ResponseViewer from "./components/response_viewer";
import TanstackQueryProvider from "./context/TanstackQueryProvider";

const App = () => {
  return (
    <>
      <TanstackQueryProvider>
        <AddEndpointPanel />
        <EndpointViewer />
        <ResponseViewer />
      </TanstackQueryProvider>
    </>
  );
};

export default App;
