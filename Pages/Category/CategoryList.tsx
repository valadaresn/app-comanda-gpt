import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Container, Typography } from "@mui/material";
import { listenToCollection, updateDocument } from "../../FirebaseService";
import { collectionNames } from "../../firebaseConfig";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null); // Para identificar o item arrastado

  useEffect(() => {
    const unsubscribe = listenToCollection(collectionNames.categories, (data) => {
      const sortedData = data.sort((a, b) => a.order - b.order);
      setCategories(sortedData);
    });
    return () => unsubscribe();
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index); // Armazena o índice do item arrastado
    e.target.style.opacity = "0.5"; // Adiciona efeito visual ao item arrastado
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Permite que o item seja solto
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    const updatedCategories = [...categories];
    const [draggedItem] = updatedCategories.splice(draggedIndex, 1); // Remove o item arrastado
    updatedCategories.splice(dropIndex, 0, draggedItem); // Insere o item na nova posição

    // Reordena os itens localmente
    const reorderedCategories = updatedCategories.map((cat, index) => ({
      ...cat,
      order: index,
    }));

    setCategories(reorderedCategories); // Atualiza o estado local

    // Atualiza o Firebase
    for (const category of reorderedCategories) {
      await updateDocument(collectionNames.categories, category.id, { order: category.order });
    }

    setDraggedIndex(null); // Limpa o índice do item arrastado
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1"; // Restaura a opacidade do item
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Categorias
      </Typography>
      <List>
        {categories.map((category, index) => (
          <ListItem
            key={category.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)} // Inicia o arraste
            onDragOver={handleDragOver} // Permite que o item seja solto
            onDrop={(e) => handleDrop(e, index)} // Solta o item
            onDragEnd={handleDragEnd} // Finaliza o arraste
            style={{
              transition: "transform 0.2s ease", // Animação suave ao rearranjar
              transform: draggedIndex === index ? "scale(1.05)" : "scale(1)", // Efeito ao arrastar
              backgroundColor: draggedIndex === index ? "#f0f0f0" : "white", // Destaque visual
            }}
            divider
          >
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default CategoryList;