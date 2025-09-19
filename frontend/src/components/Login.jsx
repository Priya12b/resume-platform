import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState('hire-me@anshumat.org');
  const [password, setPassword] = useState('HireMe@2025!');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => password.trim().length > 0;
  const isFormValid = validateEmail(email) && validatePassword(password);


  const submit = async () => {
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);
      const res = await axios.post('http://localhost:8000/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      setMessage('Logged in ✅');
      console.log("Login successful, navigating to dashboard");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login failed:", err); // Log the error
      setMessage('Login failed');
    }
  }

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5">Login</Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={!validateEmail(email) && email !== ''}
        helperText={!validateEmail(email) && email !== '' ? "Enter a valid email" : ""}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={!validatePassword(password) && password !== ''}
        helperText={!validatePassword(password) && password !== '' ? "Password is required" : ""}
      />

      <Button
        variant="contained"
        onClick={submit}
        disabled={!isFormValid}
      >
        Login
      </Button>

      <Typography>{message}</Typography>
    </Box>
  );
}