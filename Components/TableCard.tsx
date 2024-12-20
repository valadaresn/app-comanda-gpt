import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


function TableCard({ text, backgroundColor, textColor, destinationUrl }: TableCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(destinationUrl);
  }

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor, // Cor de fundo definida pela prop
        "&:hover": { backgroundColor: `${backgroundColor}CC` }, // Fundo mais claro no hover (com transparência)
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ color: textColor }}>
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TableCard;

interface TableCardProps {
    text: string; // Texto exibido no card (ex.: "Comanda 1" ou "Abrir Mesa")
    backgroundColor: string; // Cor de fundo do card
    textColor: string; // Cor do texto no card
    destinationUrl: string; // URL para onde o card deve navegar ao ser clicado
  }