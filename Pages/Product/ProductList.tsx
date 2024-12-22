import React, { useEffect, useState } from "react"; 
import { List, ListItem, ListItemText, Checkbox, ListItemIcon, Typography, Box, Chip, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { listenToCollection, updateDocument } from "../FirebaseService";

function ProductList({ db }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeCategories = listenToCollection(db, "categories", (data) => {
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].id); // Seleciona a primeira categoria por padrão
      }
    });

    const unsubscribeProducts = listenToCollection(db, "products", (data) => {
      setProducts(data);
      setLoading(false);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, [db]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleToggleMenuStatus = async (product) => {
    try {
      await updateDocument(db, "products", product.id, { inMenu: !product.inMenu });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const handleNewProduct = () => {
    navigate(`/products/new`, { state: { categoryId: selectedCategory } });
  };

  const handleEditProduct = (product) => {
    navigate(`/products/edit/${product.id}`, { state: { categoryId: product.categoryId } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Lista de Produtos
      </Typography>

      {/* Chips para seleção de categorias */}
      <Box display="flex" flexWrap="wrap" gap={1} marginBottom="1rem">
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            color={selectedCategory === category.id ? "primary" : "default"}
            onClick={() => handleCategoryChange(category.id)}
            clickable
          />
        ))}
      </Box>

      {/* Lista de produtos com checkbox */}
      <List>
        {products
          .filter((product) => product.categoryId === selectedCategory)
          .map((product) => (
            <ListItem
              key={product.id}
              button
              onClick={() => handleEditProduct(product)}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={product.inMenu || false}
                  tabIndex={-1}
                  disableRipple
                  onChange={(e) => {
                    e.stopPropagation(); // Evita navegar ao clicar no checkbox
                    handleToggleMenuStatus(product);
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={product.name}
                secondary={`R$ ${product.price.toFixed(2)}`}
              />
            </ListItem>
          ))}
      </List>

      <Box marginTop="1rem">
        <Chip
          label="Adicionar Produto"
          icon={<AddIcon />}
          color="primary"
          onClick={handleNewProduct}
          clickable
        />
      </Box>
    </Box>
  );
}

export default ProductList;