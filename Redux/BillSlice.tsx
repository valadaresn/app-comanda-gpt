import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { Firestore } from 'firebase/firestore';
import { listenToCollection, updateDocument } from '../FirebaseService';
import { Bill } from '../Models/BillSchema';

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

//usar function ao inves de arrow function para poder usar o this

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

export const { setItems, setBill, setOpenBills, setLoading, calculateSubtotal, calculateFinalValue } = billSlice.actions;

//fazer import do where e do orderBy para fazer a query 
//import { collection, query, where, orderBy } from "firebase/firestore";
//faça a função abaixo com isso
// export const fetchOpenBills = (db: Firestore) => async (dispatch: any) => {
//   dispatch(setLoading(true));
//   const q = query(collection(db, "bills"), where("status", "==", "Open"), orderBy("createdAt"));
//   const bills = await getDocs(q);
//   dispatch(setOpenBills(bills.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   dispatch(setLoading(false));





export const fetchOpenBills = (db: Firestore) => async (dispatch: any) => {
  dispatch(setLoading(true));
  listenToCollection(db, 'bills', (data) => {
    const openBills = data.filter((bill: Bill) => bill.status === 'Open');
    dispatch(setOpenBills(openBills));
    dispatch(setLoading(false));
  });
};

export const fetchBillDetails = (db: Firestore, billId: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  listenToCollection(db, `bills/${billId}/items`, (data) => {
    dispatch(setItems(data));
    dispatch(calculateSubtotal());
    dispatch(setLoading(false));
  });
  listenToCollection(db, 'bills', (data) => {
    const currentBill = data.find((b: Bill) => b.id === billId);
    if (currentBill) {
      dispatch(setBill(currentBill));
    }
  });
};

export const closeBill = (db: Firestore, billId: string, data: Bill) => async (dispatch: any) => {
  try {
    data.status = 'Paid';
    await updateDocument(db, 'bills', billId, data);
    console.log(`Comanda ${billId} encerrada com sucesso.`);
  } catch (error) {
    console.error("Erro ao encerrar a comanda:", error);
    throw new Error("Falha ao encerrar a comanda.");
  }
};

export const cancelItem = (db: Firestore, itemId: string, billId: string) => async (dispatch: any) => {
  try {
    await updateDocument(db, `bills/${billId}/items`, itemId, { isCanceled: true });
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