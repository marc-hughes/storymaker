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
import { useNavigate, useSearchParams } from "react-router-dom";

const ConfirmSignup: React.FC = () => {
  const { confirmSignup } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>(searchParams.get("email") || "");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignup(email, code);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Confirmation failed");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleConfirmation}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 300,
        margin: "0 auto",
        mt: 5,
      }}
    >
      <Typography fontSize="xl" fontWeight="lg">
        Confirm Sign Up
      </Typography>
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
        <FormLabel>Confirmation Code</FormLabel>
        <Input
          autoFocus={true}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </FormControl>
      <Button type="submit">Confirm</Button>
    </Box>
  );
};

export default ConfirmSignup;
