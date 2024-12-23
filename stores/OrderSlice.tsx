import { createSlice, configureStore } from "@reduxjs/toolkit";
import { writeBatch, doc, updateDoc } from "firebase/firestore";

// Estado e Reducers
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderItems: [],
    bill: null,
    subtotal: {},
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.orderItems.find(
        (item) => item.id === newItem.id && item.orderId === newItem.orderId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.orderItems.push(newItem);
      }
    },
    removeItem: (state, action) => {
      state.orderItems = state.orderItems.filter((item) => item.id !== action.payload);
    },
    setBill: (state, action) => {
      state.bill = action.payload;
    },
    calculateSubtotal: (state, action) => {
      const billId = action.payload;
      const items = state.orderItems.filter(
        (item) => item.billId === billId && !item.isCanceled
      );
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.subtotal[billId] = total;
    },
  },
});

// Método para cancelar um item no Firebase
export async function cancelarItem(db, itemId, billId) {
  try {
    const itemRef = doc(db, `bills/${billId}/items`, itemId); // Caminho ajustado para "bills"
    await updateDoc(itemRef, { isCanceled: true });
    console.log(`Item ${itemId} cancelado com sucesso.`);
  } catch (error) {
    console.error("Erro ao cancelar o item:", error);
    throw new Error("Falha ao cancelar o item.");
  }
}

// Método para finalizar a ordem usando Firebase Batch
export async function finalizarOrder(db, orderId, items) {
  if (items.length === 0) {
    throw new Error("Nenhum item para finalizar.");
  }

  const batch = writeBatch(db);

  // Cria o documento do pedido
  const orderRef = doc(db, "orders", orderId);
  batch.set(orderRef, { id: orderId, createdAt: new Date() });

  // Adiciona todos os itens ao batch
  items.forEach((item) => {
    const itemRef = doc(db, `orders/${orderId}/items`, item.id);
    batch.set(itemRef, item);
  });

  try {
    await batch.commit();
    console.log("Pedido e itens finalizados com sucesso.");
  } catch (error) {
    console.error("Erro ao finalizar o pedido:", error);
    throw new Error("Falha ao finalizar o pedido.");
  }
}

// Exportações
export const {
  addItem,
  removeItem,
  setBill,
  calculateSubtotal,
} = orderSlice.actions;

const store = configureStore({
  reducer: {
    order: orderSlice.reducer,
  },
});

export default store;
