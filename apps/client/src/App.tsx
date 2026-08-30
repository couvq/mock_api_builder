import AddEndpointPanel from "./components/add_endpoint_panel";
import EndpointViewer from "./components/endpoint_viewer";
import ResponseViewer from "./components/response_viewer";

const App = () => {
  return (
    <>
      <AddEndpointPanel />
      <EndpointViewer />
      <ResponseViewer />
    </>
  );
};

export default App;
