import React, { createContext, useContext, useState } from "react";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AuthenticationResultType,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: "us-west-2", // Replace with your AWS region
});

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  signup: (email: string, password: string) => Promise<void>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => string | null;
  refreshToken: () => Promise<User | null>;
}

interface User {
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  confirmSignup: async () => {},
  signup: async () => {},
  login: async () => {},
  logout: () => {},
  getAccessToken: () => null,
  refreshToken: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const savedUser = localStorage.getItem("user");
  const hasSavedUser = savedUser !== null;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasSavedUser);
  const [user, setUser] = useState<User | null>(
    JSON.parse(savedUser || "null")
  );

  const signup = async (email: string, password: string) => {
    const command = new SignUpCommand({
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
    });

    await client.send(command);
  };

  const confirmSignup = async (email: string, code: string) => {
    const command = new ConfirmSignUpCommand({
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });

    await client.send(command);
    // After confirmation, the user still needs to log in
  };

  const login = async (email: string, password: string) => {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const authResponse = await client.send(command);
    const response: AuthenticationResultType =
      authResponse.AuthenticationResult as AuthenticationResultType;

    if (response?.AccessToken && response?.RefreshToken && response?.IdToken) {
      //response.
      const newUser: User = {
        name: "",
        email,
        accessToken: response.AccessToken,
        refreshToken: response.RefreshToken,
        idToken: response.IdToken,
      };
      setIsAuthenticated(true);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  const getAccessToken = () => {
    return user?.idToken || null;
  };

  const refreshToken = async (): Promise<User | null> => {
    if (!user?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: user.refreshToken,
      },
    });

    try {
      const response = await client.send(command);
      if (
        response.AuthenticationResult?.AccessToken &&
        response.AuthenticationResult?.IdToken
      ) {
        const updatedUser: User = {
          ...user,
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout(); // Force logout if refresh fails
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signup,
        login,
        logout,
        confirmSignup,
        getAccessToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
