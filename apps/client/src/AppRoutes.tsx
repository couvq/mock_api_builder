import type { ReactNode } from "react";
import CreateEndpoint from "./pages/CreateEndpoint";
import EditEndpoint from "./pages/EditEndpoint";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router";

type path = "/" | "/dashboard" | "/endpoint/new" | "/endpoint/edit" | "*";

const routeConfig: Record<path, ReactNode> = {
  "/": <Dashboard />,
  "/dashboard": <Dashboard />,
  "/endpoint/new": <CreateEndpoint />,
  "/endpoint/edit": <EditEndpoint />,
  "*": <NotFound />,
};

const AppRoutes = () => {
  return (
    <Routes>
      {Object.entries(routeConfig).map(([path, element]) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
