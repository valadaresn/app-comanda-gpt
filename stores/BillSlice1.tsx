import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { writeBatch, doc } from 'firebase/firestore';
import { createDocument, updateDocument } from '../services/FirebaseService';
import { Bill } from '../models/BillSchema';
import { defaultDb } from '../config/firebaseConfig';

interface BillState {
  items: any[];
  bill: Bill | null;
  openBills: Bill[];
  loading: boolean;
}

const initialState: BillState = {
  items: [],
  bill: null,
  openBills: [],
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
    setOpenBills: (state, action: PayloadAction<Bill[]>) => {
      state.openBills = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearBillState: (state) => {
      state.items = [];
      state.bill = null;
      state.loading = true;
    },
    calculateSubtotal: (state) => {
      if (state.bill) {
        state.bill.subTotal = state.items
          .filter(item => !item.isCanceled)
          .reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    },
    calculateFinalValue: (state) => {
      if (state.bill) {
        let finalValue = state.bill.subTotal;
        if (state.bill.applyDiscount) {
          finalValue -= (state.bill.subTotal * (state.bill.discount / 100));
        }
        if (state.bill.applyServiceCharge) {
          finalValue += state.bill.serviceCharge;
        }
        state.bill.finalValue = finalValue;
      }
    },
  },
});

export const { setItems, setBill, setOpenBills, setLoading, clearBillState, calculateSubtotal, calculateFinalValue } = billSlice.actions;

export const createBill = (bill: Bill) => async (dispatch: any) => {
  const batch = writeBatch(defaultDb);
  try {
    const billRef = doc(defaultDb, 'bills', bill.id);
    const tableRef = doc(defaultDb, 'tables', String(bill.tableId));
    batch.set(billRef, bill);
    batch.update(tableRef, { status: 'Occupied' });
    await batch.commit();
    console.log(`Comanda criada para a mesa ${bill.tableId} com sucesso.`);
  } catch (error) {
    console.error("Erro ao criar a comanda:", error);
    throw new Error("Falha ao criar a comanda.");
  }
};

export const closeBill = (billId: string, data: Bill) => async (dispatch: any) => {
  const batch = writeBatch(defaultDb);
  try {
    const billRef = doc(defaultDb, 'bills', billId);
    const tableRef = doc(defaultDb, 'tables', String(data.tableId));
    batch.update(billRef, { ...data, status: 'Paid' });
    batch.update(tableRef, { status: 'Free' });
    await batch.commit();
    console.log(`Comanda ${billId} encerrada com sucesso.`);
    dispatch(clearBillState());
  } catch (error) {
    console.error("Erro ao encerrar a comanda:", error);
    throw new Error("Falha ao encerrar a comanda.");
  }
};

export const cancelItem = (itemId: string, billId: string) => async (dispatch: any) => {
  try {
    await updateDocument(`bills/${billId}/items`, itemId, { isCanceled: true });
    console.log(`Item ${itemId} cancelado com sucesso.`);
    dispatch(calculateSubtotal());
  } catch (error) {
    console.error("Erro ao cancelar o item:", error);
    throw new Error("Falha ao cancelar o item.");
  }
};

const store = configureStore({
  reducer: {
    bill: billSlice.reducer,
  },
});

export default store;