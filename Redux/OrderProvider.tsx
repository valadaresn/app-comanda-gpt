import React, { createContext, useContext, useState } from "react";
import { FirebaseService } from "./FirebaseService"; // Simula o serviço Firebase

// Types
export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isCanceled?: boolean; // Marca se o item foi cancelado
  orderId: string; // ID da ordem
  billId: string; // ID da comanda
};

export type Bill = {
  id: string;
  table: number;
  status: string; // Ex: "Open", "Closed"
  createdAt: Date;
};

// Context
const OrderContext = createContext<{
  orderItems: OrderItem[];
  bill: Bill | null;
  subtotal: number;
  addItem: (item: OrderItem) => void;
  removeItem: (itemId: string) => void;
  cancelItem: (itemId: string, billId: string) => Promise<void>;
  finalizeOrder: (orderId: string) => Promise<void>;
  getSubtotal: (billId: string) => number;
  getBill: (billId: string) => Promise<void>;
}>({
  orderItems: [],
  bill: null,
  subtotal: 0,
  addItem: () => {},
  removeItem: () => {},
  cancelItem: async () => {},
  finalizeOrder: async () => {},
  getSubtotal: () => 0,
  getBill: async () => {},
});

// Provider
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [bill, setBill] = useState<Bill | null>(null);
  const [subtotal, setSubtotal] = useState<{ [billId: string]: number }>({});

  // Serviço Firebase simulado
  const firebaseService = new FirebaseService();

  // Adiciona um item (apenas ao contexto)
  const addItem = (newItem: OrderItem) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === newItem.id && item.orderId === newItem.orderId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        return [...prevItems];
      }

      return [...prevItems, newItem];
    });
  };

  // Remove um item do contexto
  const removeItem = (itemId: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Cancela um item (atualiza no contexto e no Firebase)
  const cancelItem = async (itemId: string, billId: string) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.billId === billId ? { ...item, isCanceled: true } : item
      )
    );

    // Atualiza no Firebase
    await firebaseService.updateSubCollection("bills", billId, "items", itemId, { isCanceled: true });

    calculateSubtotal(billId); // Recalcula o subtotal
  };

  // Finaliza o pedido e persiste no Firebase
  const finalizeOrder = async (orderId: string, items: OrderItem[]) => {
    if (items.length === 0) {
      throw new Error("No items to finalize.");
    }

    const batch = writeBatch(db);
    const orderRef = doc(db, "orders", orderId);

    batch.set(orderRef, { id: orderId, createdAt: new Date() });

    items.forEach((item) => {
      const itemRef = doc(db, "orders", orderId, "items", item.id);
      batch.set(itemRef, item);
    });

    try {
      await batch.commit();
      console.log("Order and items successfully committed.");
      setOrderItems(prevItems => prevItems.filter(item => item.orderId !== orderId));
    } catch (error) {
      console.error("Error committing batch: ", error);
      throw new Error("Failed to finalize order.");
    }
  };

  // Calcula o subtotal para uma comanda específica
  const calculateSubtotal = (billId: string) => {
    const itemsForBill = orderItems.filter(item => item.billId === billId && !item.isCanceled);
    const total = itemsForBill.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(prev => ({ ...prev, [billId]: total }));
  };

  // Retorna o subtotal para uma comanda específica
  const getSubtotal = (billId: string): number => {
    return subtotal[billId] || 0;
  };

  // Carrega a comanda e os itens associados
  const getBill = async (billId: string) => {
    const billData = await firebaseService.getDocument<Bill>("bills", billId);
    const itemsData = await firebaseService.getSubCollection<OrderItem>("bills", billId, "items");

    setBill(billData);
    setOrderItems(itemsData);
    calculateSubtotal(billId);
  };

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        bill,
        subtotal: getSubtotal,
        addItem,
        removeItem,
        cancelItem,
        finalizeOrder,
        getSubtotal,
        getBill,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook para acessar o contexto
export const useOrder = () => useContext(OrderContext);
