import { collection, getDocs } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase-config";
const products=[]
  //states - products,loading,error
  //actions - fetchProducts
export const useFarmStore = create((set) => ({

  products: [],
  topProducts: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await getDocs(collection(db, "farm-products"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ products: items, loading: false, topProducts: items.slice(0, 21) });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
  addDataToCollection: async () => {
    const batch = writeBatch(db);
    products.forEach((product) => {
      const docRef = doc(db, "farm-products", product.id.toString());
      batch.set(docRef, product);
    });
    const res = await batch.commit();
  },
}));
