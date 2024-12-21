import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { listenToCollection } from "../FirebaseService";

function CategoryList({ db }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection(db, "categories", (data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const handleEditCategory = (id) => {
    navigate(`/categories/edit/${id}`);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Lista de Categorias
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2">
                    Ordem: {category.order}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditCategory(category.id)}
                    style={{ marginTop: "1rem" }}
                  >
                    Editar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default CategoryList;
