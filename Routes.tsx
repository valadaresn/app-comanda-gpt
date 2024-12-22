import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Componentes Importados
import SelectItemForOrder from "./Pages/Order/SelectItemForOrder";
import CreateOrderItem from "./Pages/Order/CreateOrderItem";
import OpenBills from "./Pages/Bill/OpenBills";
import CategoryList from "./Pages/Category/CategoryList";
import CategoryForm from "./Pages/Category/CategoryForm";
import ProductList from "./Pages/Product/ProductList";
import ProductForm from "./Pages/Product/ProductForm";
import CreateBill from "./Pages/Bill/CreateBill";
import CheckoutBill from "./Pages/Bill/CheckoutBill";
import BillDetails from "./Pages/Bill/BillDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Comandas Abertas, que vai para BillDetails (Tela Inicial) */}
        <Route
          path="/OpenBills"
          element={
            <OpenBills
              backgroundColor="#E3F2FD" // Azul claro
              textColor="#0D47A1" // Azul escuro
              destinationUrl="/BillDetails"
            />
          }
        />
        {/* Criar Nova Comanda */}
        <Route path="/CreateBill" element={<CreateBill />} />

        {/* Detalhes da Comanda */}
        <Route path="/BillDetails/:id" element={<BillDetails />} />        

        {/* Comandas Abertas para Criar Pedido */}
        <Route
          path="/OpenBills"
          element={
            <OpenBills
              backgroundColor="#E8F5E9" // Verde claro
              textColor="#1B5E20" // Verde escuro
              destinationUrl="/CreateOrderItem"
            />
          }
        />

        {/* Pedido */}
        <Route path="/SelectItemForOrder" element={<SelectItemForOrder />} />
        <Route path="/CreateOrderItem" element={<CreateOrderItem />} />

        {/* Categorias */}
        <Route path="/CategoryList" element={<CategoryList />} />
        <Route path="/CategoryForm" element={<CategoryForm />} />
        <Route path="/CategoryForm/:id" element={<CategoryForm />} />

        {/* Produtos */}
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/ProductForm" element={<ProductForm />} />
        <Route path="/ProductForm/:id" element={<ProductForm />} />

        {/* Encerrar Comanda */}
        <Route path="/CheckoutBill/:id" element={<CheckoutBill />} />
      </Routes>
    </Router>
  );
}

export default App;