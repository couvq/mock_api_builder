import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";
import AppThemeProvider from "./context/AppThemeProvider";
import EditorContextProvider from "./context/Editor/EditorContext";
import MockRequestProvider from "./context/MockRequest/MockRequestProvider";
import TanstackQueryProvider from "./context/TanstackQueryProvider";
import ToastProvider from "./context/ToastProvider";

const App = () => (
  <AppThemeProvider>
    <TanstackQueryProvider>
      <ToastProvider>
        <EditorContextProvider>
          <MockRequestProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </MockRequestProvider>
        </EditorContextProvider>
      </ToastProvider>
    </TanstackQueryProvider>
  </AppThemeProvider>
);

export default App;
