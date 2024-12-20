import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addItemToOrder, clearSelectedProduct } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
} from "@mui/material";

function CreateOrderItem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.order.selectedProduct);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    dispatch(
      addItemToOrder({
        ...product,
        ...data,
        quantity: Number(data.quantity), // Certifica que é numérico
      })
    );
    dispatch(clearSelectedProduct());
    navigate(-1); // Volta para a tela anterior
  };

  if (!product) {
    return <Typography variant="h6">Produto não encontrado.</Typography>;
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Adicionar Detalhes do Item
      </Typography>
      <Typography variant="h6">{product.name}</Typography>
      <Typography variant="body1" gutterBottom>
        Preço: R$ {product.price.toFixed(2)}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField
          label="Quantidade"
          type="number"
          defaultValue={1}
          inputProps={{ min: 1 }}
          {...register("quantity", { required: true })}
          fullWidth
        />

        <TextField
          label="Observação"
          multiline
          rows={3}
          {...register("observation")}
          fullWidth
        />

        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
      </Box>
    </Container>
  );
}

export default CreateOrderItem;
