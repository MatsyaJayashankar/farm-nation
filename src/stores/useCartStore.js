import {
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  collection,
  writeBatch,
} from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase-config";
import { toast } from "sonner";

export const useCartStore = create((set, get) => ({
  items: [],
  totalQuantity: 0,

  updateCart: async (uid, item, delta = 1) => {
    const state = get();
    let newQty = delta;
    const itemExists = state.items.find((i) => i.id === item.id);
    let updatedItems;

    if (itemExists) {
      updatedItems = state.items
        .map((i) => {
          if (i.id === item.id) {
            newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean); // removes nulls (if item was deleted)
    } else if (delta > 0) {
      updatedItems = [...state.items, { ...item, quantity: delta }];
    } else {
      updatedItems = [...state.items]; // unchanged if trying to remove nonexistent item
    }
    const totalQuantity = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    set({ items: updatedItems, totalQuantity });
    toast.success(
      `${item.name} ${delta > 0 ? "added to" : "removed from"} cart`
    );
    // 🔄 Sync with Firebase
    const docRef = doc(db, "farm-carts", String(uid), "items", String(item.id));
    if (delta !== 0) {
      await setDoc(docRef, { ...item, quantity: newQty }, { merge: true });
      console.log(`✅ Updated "${item.id}" to ${newQty} for "${uid}".`);
    } else if (delta === 0) {
      await deleteDoc(docRef);
      console.log(`🗑️ Removed "${item.id}" for "${uid}".`);
    }
  },

  fetchCart: async (uid) => {
    if (!uid) return;
    const snapshot = await getDocs(collection(db, "farm-carts", uid, "items"));
    set({ items: snapshot.docs.map((doc) => doc.data()) }); //update local state
  },

  clearCart: async (uid) => {
    try {
      const snapshot = await getDocs(
        collection(db, "farm-carts", uid, "items")
      );
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      set({ items: [], totalQuantity: 0 });
      console.log("Cleared Cart");
      toast.success("Cart cleared");
    } catch (err) {
      console.error(`❌ Error clearing cart for user "${uid}":`, err);
      toast.error(`❌ Error clearing cart"`);
    }
  },
}));
