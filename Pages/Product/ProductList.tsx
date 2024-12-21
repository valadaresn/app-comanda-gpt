import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Button, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { listenToCollection } from "../FirebaseService";

function ProductList({ db }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeCategories = listenToCollection(db, "categories", (data) => {
      setCategories(data);
      setLoading((prev) => !prev && true); // Atualiza somente após carregar categorias
    });

    const unsubscribeProducts = listenToCollection(db, "products", (data) => {
      setProducts(data);
      setLoading(false); // Finaliza carregamento após carregar produtos
    });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, [db]);

  const handleNewProduct = () => navigate("/ProdutoForm");
  const handleEditProduct = (id: string) => navigate(`/ProdutoForm/${id}`);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ marginTop: "2rem" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Lista de Produtos</Typography>
        <Button variant="contained" color="primary" onClick={handleNewProduct}>
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((category) => (
              <React.Fragment key={`section-${category.id}`}>
                {/* Cabeçalho de Categoria */}
                <TableRow>
                  <TableCell colSpan={2} style={{ backgroundColor: "#f5f5f5" }}>
                    <Typography variant="h6">{category.name}</Typography>
                  </TableCell>
                </TableRow>

                {/* Produtos da Categoria */}
                {products
                  .filter((product) => product.categoryId === category.id)
                  .map((product) => (
                    <TableRow
                      key={`product-${product.id}`}
                      hover
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditProduct(product.id)}
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ProductList;
