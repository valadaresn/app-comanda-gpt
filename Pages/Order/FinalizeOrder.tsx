import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { finalizeOrder } from "../services/OrderService"; // Importa o serviço
import { removeItem, clearOrder } from "../stores/OrderSlice";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function FinalizeOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderItems = useSelector((state) => state.order.orderItems);
  const bill = useSelector((state) => state.order.bill); // Use bill instead of tableNumber

  const handleFinalizeOrder = async () => {
    try {
      await finalizeOrder(orderItems); // Passa a lista de itens para o serviço
      dispatch(clearOrder()); // Limpa o estado do pedido
      navigate("/"); // Navega para a página inicial ou outra rota apropriada
    } catch (error) {
      console.error("Error finalizing order:", error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      dispatch(clearOrder()); // Limpa o estado do pedido
      navigate("/OpenBillsForOrder"); // Navega para a página de contas abertas
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Finalize Order
      </Typography>
      {bill && (
        <Typography variant="h6">
          Table Number: {bill.tableId}
        </Typography>
      )}
      <List>
        {orderItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.productName}
              secondary={`Quantity: ${item.quantity} - Price: $${item.salePrice.toFixed(2)}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" 
                onClick={() => handleRemoveItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary"
        onClick={() => navigate("/SelectItemForOrder")}>
        New Order
      </Button>
      <Button variant="contained" color="secondary" 
        onClick={handleFinalizeOrder} 
        style={{ marginLeft: "1rem" }}>
        Finalize Order
      </Button>
      <Button variant="contained" color="default" 
        onClick={handleCancelOrder} 
        style={{ marginLeft: "1rem" }}>
        Cancel Order
      </Button>
    </Container>
  );
}

export default FinalizeOrder;