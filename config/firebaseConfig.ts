import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const defaultDb = getFirestore(app);

// Objeto para nomes das coleções
export const collectionNames = {
  categories: "categories",
  products: "products",
  bills: "bills",
  tables: "tables",
  orders: "orders",
  orderItems: "orderItems",
  // Adicione outras coleções conforme necessário
};