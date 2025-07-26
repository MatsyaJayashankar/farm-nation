import {
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  collection,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase-config";
import { toast } from "sonner";
import { nanoid } from "nanoid";

export const useCartStore = create((set, get) => ({
  items: [],
  orders: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,

  setCart: (items = []) => {
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => {
      const priceMatch = i.price?.match(/\d+(\.\d+)?/);
      const priceNum = priceMatch ? parseFloat(priceMatch[0]) : 0;
      return sum + priceNum * i.quantity;
    }, 0);
    set({ items, totalQuantity, totalPrice });
  },

  updateCart: async (uid, item, delta = 1) => {
    const state = get();
    const existingItem = state.items.find((i) => i.id === item.id);
    const newQty = (existingItem?.quantity ?? 0) + delta;
    if (newQty < 0) return; // Prevent negative quantities

    let updatedItems = state.items
      .map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      .filter((i) => i.quantity > 0); // Filter out items with quantity 0

    if (!existingItem && delta > 0) {
      updatedItems = [...updatedItems, { ...item, quantity: delta }]; // Add new item to cart
    }
    //update Firebase
    const docRef = doc(db, "farm-carts", String(uid), "items", String(item.id));
    if (newQty > 0) {
      await setDoc(docRef, { ...item, quantity: newQty }, { merge: true });
      console.log(`✅ Updated "${item.id}" to ${newQty} for "${uid}".`);
    } else {
      await deleteDoc(docRef);
      console.log(`🗑️ Removed "${item.id}" for "${uid}".`);
    }

    get().setCart(updatedItems);
    if (delta !== 0) {
      toast.success(
        `${item.name} ${delta > 0 ? "added to" : "removed from"} cart`
      );
    }
  },

  fetchCart: async (uid) => {
    if (!uid) return;
    set({ loading: true });

    const snapshot = await getDocs(collection(db, "farm-carts", uid, "items"));
    get().setCart(snapshot.docs.map((doc) => doc.data()));
    set({ loading: false });
  },

  clearCart: async (uid) => {
    try {
      const snapshot = await getDocs(
        collection(db, "farm-carts", uid, "items")
      );
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      get().setCart([]);
      console.log("🧹 Cleared Cart");
      toast.success("Cart cleared");
    } catch (err) {
      console.error(`❌ Failed to clear cart for "${uid}":`, err);
      toast.error("Failed to clear cart");
    }
  },
  //PURCHASE
  purchase: async (uid) => {
    if (!uid) return;

    const { items, totalPrice } = get();
    const orderId = nanoid(); // ensure this is imported

    const orders = {
      date: serverTimestamp(),
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      total: totalPrice,
      status: "pending",
    };

    const docRef = doc(
      db,
      "farm-orders",
      String(uid),
      "orders",
      String(orderId)
    );
    try {
      await setDoc(docRef, orders, { merge: true });
      await get().clearCart(uid);
      toast.success("Order placed!");
    } catch (err) {
      console.error("❌ Failed to place order:", err);
      toast.error("Order placement failed");
    }
  },
  fetchOrders: async (uid) => {
    if (!uid) return;
    const snapshot = await getDocs(
      collection(db, "farm-orders", uid, "orders")
    );
    set({ orders: snapshot.docs.map((doc) => doc.data()) });
  },
}));
