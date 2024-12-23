import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedProduct } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import { listenToCollection } from "../FirebaseService";
import {  Card,  CardContent,  Typography,  Button,  Grid,  Container,  CircularProgress} from "@mui/material";

function SelectItemForOrder({ db }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToCollection(db, "products", (data) => {
      setProducts(data);
      setLoading(false);
    }, []);
    return () => unsub();
  }, [db]);

  const handleSelectProduct = (product) => {
    dispatch(setSelectedProduct(product));
    navigate("/CreateOrderItem");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Selecione um Produto
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1">{product.name}</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    R$ {product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleSelectProduct(product)}
                >
                  Selecionar
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default SelectItemForOrder;
