import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Grid, Typography, TextField, Box } from "@mui/material";
import { Firestore } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { listenToCollection } from "../../FirebaseService";
import { createBill } from "../../Redux/BillSlice";
import { BillSchema, Bill } from "../../Models/BillSchema";
import TableCard from "../TableCard";

interface CreateBillProps {db: Firestore;}

const CreateBill: React.FC<CreateBillProps> = ({ db }) => {
  const dispatch = useDispatch();
  const [tables, setTables] = useState<any[]>([]);
  const defaultValues = BillSchema.parse({});
 
  const {register, handleSubmit,   formState: { errors },  } = useForm<Bill>({
    resolver: zodResolver(BillSchema),
    defaultValues,
  });

  // Busca as mesas livres ao montar o componente
  useEffect(() => {
    const unsubscribe = listenToCollection(db, "tables", (data) => {
      const freeTables = data.filter((table: any) => table.status === "Free");
      setTables(freeTables);
    });

    return () => unsubscribe();
  }, [db]);

  // Manipula o clique em uma mesa para criar a comanda
  const handleTableClick = (tableId: number) => {
    handleSubmit((data) => {
      try {
        const bill = BillSchema.parse({
          ...data,
          tableId,
        });
        dispatch(createBill(db, bill));
      } catch (error) {
        console.error("Erro ao validar a comanda:", error);
        alert("Erro ao criar a comanda. Verifique os dados e tente novamente.");
      }
    })();
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Criar Comanda
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) => {
          console.log("Dados do formulário:", data);
        })}
        sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField
          label="Número de Ocupantes"
          type="number"
          {...register("occupants", { valueAsNumber: true })}
          error={!!errors.occupants}
          helperText={errors.occupants?.message}
          fullWidth
        />
        <Box sx={{ flexGrow: 1, p: 2, backgroundColor: "#FFF3E0", height: "100vh" }}>
          <Grid container spacing={2}>
            {tables.map((table) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={table.id}>
                <TableCard
                  text={`Mesa ${table.id}`}
                  backgroundColor="#FFF3E0" // Laranja claro. 
                  textColor="#E65100" // Laranja escuro
                  destinationUrl={`/bills/create/${table.id}`}
                  onClick={() => handleTableClick(table.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateBill;
