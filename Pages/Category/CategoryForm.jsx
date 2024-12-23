import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { createDocument, updateDocument } from "../../services/FirebaseService";
import { CategorySchema } from "../../models/CategorySchema";
import { collectionNames } from "../../config/firebaseConfig";

function CategoryForm() {
  const { id } = useParams(); // Para diferenciar entre criação e edição
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(CategorySchema)
  });

  const onSubmit = async (data) => {
    try {
      if (id) {        
        await updateDocument(collectionNames.categories, id, data);
      } else {        
        await createDocument(collectionNames.categories, data);
      }
      navigate("/CategoryList"); // Volta para a lista de categorias
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        {id ? "Editar Categoria" : "Criar Categoria"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField
          label="Nome da Categoria"
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          {...register("name")}
        />

        <TextField
          label="Ordem de Exibição"
          type="number"
          error={!!errors.order}
          helperText={errors.order?.message}
          fullWidth
          {...register("order")}
        />

        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
      </Box>
    </Container>
  );
}

export default CategoryForm;