import React, { useState } from "react";
import {
  Button,
  Input,
  Typography,
  Box,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { isError } from "./is-error";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (isError(err)) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 300,
        margin: "0 auto",
        mt: 5,
      }}
    >
      <Typography level="h4">Login</Typography>
      {error && <Typography color="danger">{error}</Typography>}
      <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl required>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button type="submit" fullWidth>
        Login
      </Button>
    </Box>
  );
};

export default Login;
