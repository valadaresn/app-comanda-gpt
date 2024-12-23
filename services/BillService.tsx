import { writeBatch, doc } from 'firebase/firestore';
import { defaultDb } from '../config/firebaseConfig';
import { Bill } from '../models/BillSchema';
import { updateDocument } from '../services/FirebaseService';

export const createBill = async (bill: Bill) => {
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

export const closeBill = async (billId: string, data: Bill) => {
  const batch = writeBatch(defaultDb);
  try {
    const billRef = doc(defaultDb, 'bills', billId);
    const tableRef = doc(defaultDb, 'tables', String(data.tableId));
    batch.update(billRef, { ...data, status: 'Paid' });
    batch.update(tableRef, { status: 'Free' });
    await batch.commit();
    console.log(`Comanda ${billId} encerrada com sucesso.`);
  } catch (error) {
    console.error("Erro ao encerrar a comanda:", error);
    throw new Error("Falha ao encerrar a comanda.");
  }
};

export const cancelItem = async (itemId: string, billId: string) => {
  try {
    await updateDocument(`bills/${billId}/items`, itemId, { isCanceled: true });
    console.log(`Item ${itemId} cancelado com sucesso.`);
  } catch (error) {
    console.error("Erro ao cancelar o item:", error);
    throw new Error("Falha ao cancelar o item.");
  }
};