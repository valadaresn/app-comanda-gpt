import { writeBatch, doc, updateDoc } from 'firebase/firestore';
import { defaultDb } from '../config/firebaseConfig';
import { Bill } from '../models/BillSchema';

// Método para criar uma comanda
export const createBill = async (bill: Bill) => {
  const batch = writeBatch(defaultDb);
  try {
    const billRef = doc(defaultDb, 'bills', bill.id);
    const tableRef = doc(defaultDb, 'tables', bill.tableId); // Usa o valor numérico diretamente
    batch.set(billRef, bill);
    batch.update(tableRef, { status: 'Occupied' });
    await batch.commit();
    console.log(`Comanda criada para a mesa ${bill.tableId} com sucesso.`);
  } catch (error) {
    console.error("Erro ao criar a comanda:", error);
    throw new Error("Falha ao criar a comanda.");
  }
};

// Método para encerrar uma comanda
export const closeBill = async (billId: string, data: Bill) => {
  const batch = writeBatch(defaultDb);
  try {
    const billRef = doc(defaultDb, 'bills', billId);
    const tableRef = doc(defaultDb, 'tables', data.tableId); // Usa o valor numérico diretamente
    batch.update(billRef, { ...data, status: 'Paid' });
    batch.update(tableRef, { status: 'Free' });
    await batch.commit();
    console.log(`Comanda ${billId} encerrada com sucesso.`);
  } catch (error) {
    console.error("Erro ao encerrar a comanda:", error);
    throw new Error("Falha ao encerrar a comanda.");
  }
};

// Método para cancelar um item no Firebase
export async function cancelItem(itemId: string, billId: string) {
  try {
    const itemRef = doc(defaultDb, `bills/${billId}/items`, itemId); // Caminho ajustado para "bills"
    await updateDoc(itemRef, { isCanceled: true });
    console.log(`Item ${itemId} cancelado com sucesso.`);
  } catch (error) {
    console.error("Erro ao cancelar o item:", error);
    throw new Error("Falha ao cancelar o item.");
  }
}