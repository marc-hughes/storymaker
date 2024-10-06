import React, { useEffect } from "react";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CssVarsProvider, useColorScheme, extendTheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

const theme = extendTheme({
  components: {
    JoyChip: {
      defaultProps: {
        size: "sm",
      },
      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
      },
    },
  },
});

import { Sidebar } from "./Sidebar";

import { AppBreadcrumbs } from "./AppBreadcrumbs";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setMode } = useColorScheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setMode("dark");
  }, [setMode]);

  return (
    <>
      {/* <GlobalStyles /> */}
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Header />
          <Sidebar onLogout={handleLogout} />
          <Box
            component="main"
            className="MainContent"
            sx={{
              px: { xs: 2, md: 6 },
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isAuthenticated ? <AppBreadcrumbs /> : null}
            </Box>
            <Box
              sx={{
                display: "flex",
                mb: 1,
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "start", sm: "center" },
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            ></Box>
            {children}
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  );
};

export default Layout;
