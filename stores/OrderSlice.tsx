import { createSlice, configureStore } from "@reduxjs/toolkit";
import { OrderItem } from "../models/OrderItemSchema";
import { Bill } from "../models/BillSchema";

// Define the initial state interface
interface OrderState {
  orderItems: OrderItem[];
  bill: Bill | null;
  subtotal: number;
}

const initialState: OrderState = {
  orderItems: [],
  bill: null,
  subtotal: 0,
};

// Estado e Reducers
const orderSlice = createSlice({
  name: "order",
  initialState,
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
    calculateSubtotal: (state) => {
      const total = state.orderItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
      state.subtotal = total;
    },
    clearOrder: (state) => {
      state.orderItems = [];
      state.bill = null;
      state.subtotal = 0;
    },
  },
});

// Exportações
export const {
  addItem,
  removeItem,
  setBill,
  calculateSubtotal,
  clearOrder,
} = orderSlice.actions;

const store = configureStore({
  reducer: {
    order: orderSlice.reducer,
  },
});

export default store;