import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import { useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouteConfig, routes } from "./routes";

const queryClient = new QueryClient();

// eslint-disable-next-line react/display-name
const genRoute = (isAuthenticated: boolean) => (route: RouteConfig) => {
  const needsAuth = route.requiresAuth && !isAuthenticated;
  return (
    <Route
      key={route.path}
      path={route.path}
      element={needsAuth ? <Navigate to="/login" /> : route.body()}
    >
      {route.children?.map(genRoute(isAuthenticated))}
    </Route>
  );
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>{routes.map(genRoute(isAuthenticated))}</Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
