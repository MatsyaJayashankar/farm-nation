import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useTransition } from "react";
import Loader from "../components/ReactSpinner";

import { useCartStore } from "../stores/useCartStore";
import { useAuthStore } from "../stores/useAuthStore";
import ProductsList from "../components/ProductsList";
import { addDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function Cart() {
  const { clearCart, items, totalPrice, loading, purchase } = useCartStore();
  const uid = useAuthStore().user?.uid;
  const [isPending, startTransition] = useTransition();
  //CLEAR
  const handleClearCart = () => {
    if (uid) {
      clearCart(uid);
    }
  };
  const handlePurchase = () => {
    startTransition(() => purchase(uid));
  };

  if (isPending) return <Loader text="Placing your order..." />;

  return (
    <>
      <h2>Cart</h2>

      {items.length > 0 ? (
        <ProductsList products={items} onCart={true} />
      ) : (
        <p className="translate-y-50">Your cart is empty</p>
      )}

      {items.length > 0 && (
        <div className="flex justify-between gap-2 mt-1 shadow">
          <h2 className="bg-green-800 opacity-50 rounded ">
            Total: ₹ {totalPrice}
          </h2>
          <button className="" onClick={handleClearCart}>
            Clear Cart
          </button>
          <button disabled={isPending} onClick={handlePurchase}>
            Place Order
          </button>
        </div>
      )}
    </>
  );
}
