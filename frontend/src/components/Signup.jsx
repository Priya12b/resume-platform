import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateName = (name) => name.trim().length > 0;

  const validatePassword = (password) => password.length >= 6; // at least 6 chars

  const isFormValid =
    validateName(name) &&
    validateEmail(email) &&
    validatePassword(password);


  const submit = async () => {
    try {
      await axios.post('http://localhost:8000/auth/signup', { email, password, full_name: name });
      setMessage('Signup successful. Please login.');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      setMessage('Signup failed');
    }
  }

  return (
    <Box maxWidth={400} mx="auto">

      <Typography variant="h5">Signup</Typography>
      <TextField
        label="Full name"
        fullWidth
        margin="normal"
        value={name}
        onChange={e => setName(e.target.value)}
        error={!validateName(name) && name !== ''}
        helperText={!validateName(name) && name !== '' ? "Name is required" : ""}
      />

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={!validateEmail(email) && email !== ''}
        helperText={!validateEmail(email) && email !== '' ? "Enter valid email" : ""}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={!validatePassword(password) && password !== ''}
        helperText={!validatePassword(password) && password !== '' ? "Min 6 characters" : ""}
      />

      <Button
        variant="contained"
        onClick={submit}
        disabled={!isFormValid}
      >
        Signup
      </Button>
      <Typography>{message}</Typography>
    </Box>
  );
}