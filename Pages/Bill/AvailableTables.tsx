import React from "react";
import { Box, Grid } from "@mui/material";
import TableCard from "./TableCard";

//para criar nova comanda
function AvailableTables() {
  const freeTables = [6, 7, 8, 9, 10]; // Mock de mesas livres

  return (
    <Box sx={{ flexGrow: 1, p: 2, backgroundColor: "#FFF3E0", height: "100vh" }}>
      <Grid container spacing={2}>
        {freeTables.map((tableId) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={tableId}>
            <TableCard
              text={`Mesa ${tableId}`}
              backgroundColor="#FFF3E0" // Laranja claro
              textColor="#E65100" // Laranja escuro
              destinationUrl={`/bills/create/${tableId}`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AvailableTables;
