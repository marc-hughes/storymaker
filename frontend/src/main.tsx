import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssVarsProvider } from "@mui/joy";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CssVarsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CssVarsProvider>
  </React.StrictMode>
);
