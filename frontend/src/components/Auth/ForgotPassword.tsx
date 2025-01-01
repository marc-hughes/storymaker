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

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
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
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 300,
        margin: "0 auto",
        mt: 5,
      }}
    >
      <Typography level="h4">Forgot Password</Typography>
      {error && <Typography color="danger">{error}</Typography>}
      <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button type="submit" fullWidth>
        Send Reset Code
      </Button>
    </Box>
  );
};

export default ForgotPassword; 