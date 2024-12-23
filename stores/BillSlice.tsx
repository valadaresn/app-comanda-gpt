import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { Bill } from '../models/BillSchema';

interface BillState {
  items: any[];
  bill: Bill | null;
  subTotal: number;
  loading: boolean;
}

const initialState: BillState = {
  items: [],
  bill: null,
  subTotal: 0,
  loading: true,
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    setBill: (state, action: PayloadAction<Bill>) => {
      state.bill = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearBillState: (state) => {
      state.items = [];
      state.bill = null;
      state.subTotal = 0;
      state.loading = true;
    },
    calculateSubtotal: (state) => {
      state.subTotal = state.items
        .filter(item => !item.isCanceled)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (state.bill) {
        state.bill.subTotal = state.subTotal;
      }
    },
    calculateFinalValue: (state) => {
      if (state.bill) {
        let finalValue = state.subTotal;
        if (state.bill.applyDiscount) {
          finalValue -= (state.subTotal * (state.bill.discount / 100));
        }
        if (state.bill.applyServiceCharge) {
          finalValue += state.bill.serviceCharge;
        }
        state.bill.finalValue = finalValue;
      }
    },
  },
});

export const { setItems, setBill, setLoading, clearBillState, calculateSubtotal, calculateFinalValue } = billSlice.actions;

const store = configureStore({
  reducer: {
    bill: billSlice.reducer,
  },
});

export default store;