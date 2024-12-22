import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Box, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createDocument, updateDocument, listenToCollection } from "../FirebaseService";
import { ProductSchema } from "../Models/ProductSchema";
const nameCollection = "products";

function ProductForm({ db }) {
  const { id } = useParams(); // Para diferenciar entre criação e edição
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(ProductSchema)
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeCategories = listenToCollection(db, "categories", (data) => {
      setCategories(data);
      setLoading(false);
    });

    if (!id) {
      const categoryId = location.state?.categoryId || "";
      setValue("categoryId", categoryId);
    }

    return () => {
      unsubscribeCategories();
    };
  }, [db, id, location.state, setValue]);

  async function onSubmit(data) {
    try {
      if (id) {        
        await updateDocument("db", nameCollection, id, data);
      } else {        
        await createDocument("db", nameCollection, data);
      }
      navigate("/products"); // Volta para a lista de produtos
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        {id ? "Editar Produto" : "Criar Produto"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField
          select
          label="Categoria"
          error={!!errors.categoryId}
          helperText={errors.categoryId?.message}
          fullWidth
          {...register("categoryId")}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Nome do Produto"
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          {...register("name")}
        />

        <TextField
          label="Nome Abreviado"
          error={!!errors.shortName}
          helperText={errors.shortName?.message}
          fullWidth
          {...register("shortName")}
        />

        <TextField
          label="Preço"
          type="number"
          error={!!errors.price}
          helperText={errors.price?.message}
          fullWidth
          {...register("price")}
        />

        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
      </Box>
    </Container>
  );
}

export default ProductForm;