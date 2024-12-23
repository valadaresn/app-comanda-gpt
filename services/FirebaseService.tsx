import { Firestore, collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, QueryConstraint } from "firebase/firestore";
import { defaultDb } from '../config/firebaseConfig';

// Função genérica para escuta em tempo real
export const listenToCollection = (
  collectionName: string,
  callback: (data: any[]) => void,
  filters: QueryConstraint[] = [],
  db?: Firestore
) => {
  const database = db || defaultDb;
  const collectionRef = collection(database, collectionName);
  const collectionQuery = filters.length ? query(collectionRef, ...filters) : collectionRef;

  const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });

  return unsubscribe;
};

// Função genérica para adicionar um documento
export const createDocument = (collectionName: string, data: any, db?: Firestore) => {
  const database = db || defaultDb;
  const collectionRef = collection(database, collectionName);
  return addDoc(collectionRef, data);
};

// Função genérica para atualizar um documento
export const updateDocument = (collectionName: string, id: string, data: any, db?: Firestore) => {
  const database = db || defaultDb;
  const documentRef = doc(database, collectionName, id);
  return updateDoc(documentRef, data);
};

// Função genérica para deletar um documento
export const deleteDocument = (collectionName: string, id: string, db?: Firestore) => {
  const database = db || defaultDb;
  const documentRef = doc(database, collectionName, id);
  return deleteDoc(documentRef);
};