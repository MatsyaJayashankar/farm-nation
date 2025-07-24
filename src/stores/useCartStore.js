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
    const existingQty =
      state.items.find((i) => i.id === item.id)?.quantity || 0;
    const newQty = delta > 0 ? existingQty + delta : null;
    let updatedItems = state.items.filter((i) => i.id !== item.id);
    if (newQty > 0) {
      updatedItems.push({ ...item, quantity: newQty });
    }
    const totalQuantity = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    set({ items: updatedItems, totalQuantity });
    toast.success(
      `${item.name} ${delta > 0 ? "added to" : "removed from"} cart`
    );
    // 🔄 Sync with Firebase
    try {
      const docRef = doc(
        db,
        "farm-carts",
        String(uid),
        "items",
        String(item.id)
      );
      if (newQty > 0) {
        await setDoc(docRef, { ...item, quantity: newQty });
        console.log(`✅ Updated "${item.id}" to ${newQty} for "${uid}".`);
      } else {
        await deleteDoc(docRef);
        console.log(`🗑️ Removed "${item.id}" for "${uid}".`);
      }
    } catch (err) {
      console.error(`❌ Error syncing cart for "${item.id}":`, err);
      toast.error(`❌ Error syncing cart for "${item.id}"`);
    }
  },

  fetchCart: async (uid) => {
    if (!uid) return ;
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
      set({ items: [] });
      console.log("Cleared Cart");
      toast.success("Cart cleared");
    } catch (err) {
      console.error(`❌ Error clearing cart for user "${uid}":`, err);
      toast.error(`❌ Error clearing cart"`);
    }
  },
}));
