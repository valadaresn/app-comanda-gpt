//npm install react-router-dom

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SelectItemForOrder from "./components/SelectItemForOrder";
import CreateOrderItem from "./components/CreateOrderItem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectItemForOrder />} />
        <Route path="/create-item" element={<CreateOrderItem />} />
      </Routes>
    </Router>
  );
}

export default App;

