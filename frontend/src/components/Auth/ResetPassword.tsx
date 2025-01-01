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
import { isError } from "./is-error";

const ResetPassword: React.FC = () => {
  const { confirmForgotPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmForgotPassword(email, code, newPassword);
      navigate("/login");
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
      <Typography level="h4">Reset Password</Typography>
      {error && <Typography color="danger">{error}</Typography>}
      <FormControl required>
        <FormLabel>Reset Code</FormLabel>
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </FormControl>
      <FormControl required>
        <FormLabel>New Password</FormLabel>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormControl>
      <Button type="submit" fullWidth>
        Reset Password
      </Button>
    </Box>
  );
};

export default ResetPassword; 