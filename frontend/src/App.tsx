import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import StoryList from "./components/StoryList";
import StoryDetails from "./components/StoryDetails";
import { useAuth } from "./context/AuthContext";
import ConfirmSignup from "./components/Auth/ConfirmSignup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Layout>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              path="/signup"
              element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/confirm-signup"
              element={
                !isAuthenticated ? <ConfirmSignup /> : <Navigate to="/" />
              }
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <StoryList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/stories/:id"
              element={
                isAuthenticated ? <StoryDetails /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </QueryClientProvider>
      </Layout>
    </Router>
  );
};

export default App;
