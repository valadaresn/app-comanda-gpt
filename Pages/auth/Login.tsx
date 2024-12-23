import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/"); // Redireciona para a página principal após o login
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <Box component="form" onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Entrar
          </Button>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
};

export default Login;
