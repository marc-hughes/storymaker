import React, { createContext, useContext, useState, useEffect } from "react";
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
}

interface User {
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
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

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

    const response: AuthenticationResultType = (await client.send(command))
      .AuthenticationResult as AuthenticationResultType;

    if (response?.AccessToken && response?.RefreshToken && response?.IdToken) {
      const newUser: User = {
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
    }
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
