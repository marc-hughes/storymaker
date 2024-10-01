import React from "react";
import { Typography, Button } from "@mui/joy";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1100;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  background-color: #fff;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ContentWrapper = styled.div`
  margin-top: 64px;
  padding: 16px;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Header>
        <Typography component="h1" fontSize="xl" fontWeight="lg">
          Story Maker
        </Typography>
        <ButtonContainer>
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outlined">
              Logout
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} variant="outlined">
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} variant="outlined">
                Sign Up
              </Button>
            </>
          )}
        </ButtonContainer>
      </Header>
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
};

export default Layout;
