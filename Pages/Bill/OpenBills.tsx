import React, { useEffect, useState } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import TableCard from "../../Components/TableCard";
import { useNavigate } from 'react-router-dom';
import { listenToCollection } from '../../FirebaseService';
import { where, orderBy } from 'firebase/firestore';
import { collectionNames } from "../../firebaseConfig";
const collectionName = collectionNames.bills;

interface OpenBillsProps {
  backgroundColor: string;
  textColor: string;
  destinationUrl: string; // URL base para navegação ao clicar em uma comanda
}

function OpenBills({ backgroundColor, textColor, destinationUrl }: OpenBillsProps) {
  const navigate = useNavigate();
  const [openBills, setOpenBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToCollection(collectionNames.bills, (data) => {
        setOpenBills(data);
        setLoading(false);
      },
      [where("status", "==", "Open"), orderBy("createdAt")]
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectBill = (bill: any) => {
    navigate(`${destinationUrl}/${bill.id}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2, backgroundColor, height: "100vh" }}>
      <Grid container spacing={2}>
        {/* Card para "Abrir Mesa" */}
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <TableCard
            text="Abrir Mesa"
            backgroundColor="#FFCDD2" // Vermelho claro
            textColor="#B71C1C" // Vermelho escuro
            destinationUrl="/bills/new"
          />
        </Grid>

        {/* Lista de comandas abertas */}
        {openBills.map((bill: any) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={bill.id}>
            <TableCard
              text={`Mesa ${bill.tableNumber}`}
              backgroundColor={backgroundColor}
              textColor={textColor}
              destinationUrl={`${destinationUrl}/${bill.id}`}
              onClick={() => handleSelectBill(bill)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default OpenBills;