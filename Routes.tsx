import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OpenBills from "./components/OpenBills";
import CreateOrderItem from "./components/CreateOrderItem";
import BillDetails from "./components/BillDetails";
import CreateBill from "./components/CreateBill";
import SelectItemForOrder from "./components/SelectItemForOrder";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import CheckoutBill from "./components/CheckoutBill";
// Importe outros componentes conforme necessário

function App() {
  return (
    <Router>
      <Routes>
        {/* Criar Nova Comanda */}
        <Route path="/CreateBill" element={<CreateBill />} />

        {/* Detalhes da Comanda */}
        <Route path="/BillDetails/:id" element={<BillDetails />} />        

        {/* Comandas Abertas para Criar Pedido */}
        <Route
          path="/OpenBillsForOrder"
          element={
            <OpenBills
              backgroundColor="#E8F5E9" // Verde claro
              textColor="#1B5E20" // Verde escuro
              destinationUrl="/CreateOrderItem"
            />
          }
        />

        {/* Comandas Abertas para Visualizar Detalhes */}
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