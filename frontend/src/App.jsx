import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CreateResume from './components/CreateResume';
import ViewResume from './components/ViewResume';
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material';

function App() {
  const token = localStorage.getItem("token"); // check login state

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Resume Platform
          </Typography>

          {/* Show login/signup if NOT logged in */}
          {!token && (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}

          {/* Show dashboard + logout if logged in */}
          {token && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login"; // redirect after logout
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container style={{ marginTop: 20 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protect dashboard + resume routes */}
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/create"
            element={token ? <CreateResume /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit/:id"
            element={token ? <ViewResume mode="edit" /> : <Navigate to="/login" />}
          />
          <Route
            path="/view/:id"
            element={token ? <ViewResume /> : <Navigate to="/login" />}
          />

          {/* Default route → if logged in go dashboard else login */}
          <Route path="/" element={token ? <Dashboard /> : <Login />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
