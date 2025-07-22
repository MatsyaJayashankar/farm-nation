import {
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  collection,
  writeBatch,
  onSnapshot,
  query,
} from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase-config";

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
    }
  },

  fetchCart: (uid) => {
    // If there's an existing subscription, unsubscribe first
    if (get().unsubscribe) {
      get().unsubscribe();
    }
    const ref = collection(db, "farm-carts", uid, "items");
    const unsubscribe = onSnapshot(
      query(ref),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data());
        const totalQuantity = items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        set({ items, totalQuantity });
        console.log(
          `📦 Real-time update: Fetched ${items.length} cart items for user "${uid}".`
        );
      },
      (error) => {
        console.error("Error fetching real-time cart updates:", error);
      }
    );
    // Store the unsubscribe function
    set({ unsubscribe });
  },

  // Add a function to clear the unsubscribe listener when needed (e.g., on logout)
  clearCartListener: () => {
    if (get().unsubscribe) {
      get().unsubscribe();
      set({ unsubscribe: null });
    }
  },

  clearCart: async (uid) => {
    try {
      const cartItemsRef = collection(db, "farm-carts", uid, "items");
      const snapshot = await getDocs(cartItemsRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      set({ items: [] });
      console.log("Cleared Cart");
    } catch (err) {
      console.error(`❌ Error clearing cart for user "${uid}":`, err);
    }
  },
}));
