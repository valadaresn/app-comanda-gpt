import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SideMenu = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: "Comandas Abertas", path: "/bills" },
    { text: "Mesas Disponíveis", path: "/bills/available-tables" },
    { text: "Categorias", path: "/categories" },
    { text: "Produtos", path: "/products" },
    { text: "Pedidos", path: "/orders" },
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <Box sx={{ width: 250 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default SideMenu;
