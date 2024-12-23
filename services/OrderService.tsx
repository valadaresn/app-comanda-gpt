import { writeBatch, doc } from "firebase/firestore";
import { defaultDb } from "../config/firebaseConfig";
import { v4 as uuidv4 } from 'uuid';

// Método para finalizar a ordem usando Firebase Batch
export async function finalizeOrder(items) {
  if (items.length === 0) {
    throw new Error("Nenhum item para finalizar.");
  }

  const orderId = uuidv4();
  const batch = writeBatch(defaultDb);

  // Cria o documento do pedido
  const orderRef = doc(defaultDb, "orders", orderId);
  batch.set(orderRef, { id: orderId, createdAt: new Date() });

  // Adiciona todos os itens ao batch
  items.forEach((item) => {
    const itemRef = doc(defaultDb, `orders/${orderId}/items`, item.id);
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