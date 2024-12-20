import {
    Firestore,
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc,
    query,
    QueryConstraint,
  } from "firebase/firestore";
  
  // Função genérica para escuta em tempo real
  export const listenToCollection = (
    db: Firestore,
    collectionName: string,
    callback: (data: any[]) => void,
    filters: QueryConstraint[] = []
  ) => {
    const collectionRef = collection(db, collectionName);
    const collectionQuery = filters.length
      ? query(collectionRef, ...filters)
      : collectionRef;
  
    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
  
    return unsubscribe;
  };
  
  // Função genérica para adicionar um documento
  export const createDocument = (db: Firestore, collectionName: string, data: any) => {
    const collectionRef = collection(db, collectionName);
    return addDoc(collectionRef, data);
  };
  
  // Função genérica para atualizar um documento
  export const updateDocument = (db: Firestore, collectionName: string, id: string, data: any) => {
    const documentRef = doc(db, collectionName, id);
    return updateDoc(documentRef, data);
  };
  
  // Função genérica para deletar um documento
  export const deleteDocument = (db: Firestore, collectionName: string, id: string) => {
    const documentRef = doc(db, collectionName, id);
    return deleteDoc(documentRef);
  };
  