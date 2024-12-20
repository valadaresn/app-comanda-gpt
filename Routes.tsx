import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OpenBills from "./OpenBills";
import AvailableTables from "./AvailableTables";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela de Comandas Abertas (Visualizar e Gerenciar) */}
        <Route
          path="/bills/open"
          element={
            <OpenBills
              backgroundColor="#E3F2FD" // Azul claro
              textColor="#0D47A1" // Azul escuro
              destinationUrl="/bills/details"
            />
          }
        />

        {/* Tela de Mesas Livres para Criar Nova Comanda */}
        <Route path="/bills/new" element={<AvailableTables />} />

        {/* Tela de Comandas Abertas para Criar Pedido */}
        <Route
          path="/order-item/select"
          element={
            <OpenBills
              backgroundColor="#E8F5E9" // Verde claro
              textColor="#1B5E20" // Verde escuro
              destinationUrl="/order-item/create"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
