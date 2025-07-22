import { getDocs } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase-config";

export const useCartStore = create((set, get) => ({
  items: [],

  updateItem: async (uid, item, delta = 1) => {
    let cartItem;
    //1. update UI(local state)
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      const newQty = (existing?.quantity || 0) + delta;
      if (newQty > 0) cartItem = { ...item, quantity: newQty };
      const items = [
        ...state.items.filter((i) => i.productId !== item.productId),
        ...(cartItem ? [cartItem] : []),
      ];
      return { items };
    });
    //2. update Firebase
    const docRef = doc(db, "users", uid, "farm-carts", item.productId);
    await (cartItem ? setDoc(docRef, cartItem) : deleteDoc(docRef));
  },

  fetchCart: async (uid) => {
    const snapshot = await getDocs(
      collection(db, "users", uid, "farm-carts")
    );
    set({ items: snapshot.docs.map((doc) => doc.data()) });//update local state
  },
}));
