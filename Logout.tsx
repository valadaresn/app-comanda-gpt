import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/AuthService";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  return (
    <Button color="secondary" variant="outlined" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
