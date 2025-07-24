import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/ReactSpinner";

import { useCartStore } from "../stores/useCartStore";
import { useAuthStore } from "../stores/useAuthStore";
import ProductsList from "../components/ProductsList";

export default function Cart() {
  const { fetchCart, clearCart, items } = useCartStore();
  const uid = useAuthStore().user?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    if (uid) {
      fetchCart(uid);
      console.log(uid);
    } else {
      navigate("/login");
    }
  }, [uid, navigate, fetchCart]);

  const handleClearCart = async () => {
    if (uid) {
      await clearCart(uid);
      await fetchCart(uid);
    }
  };

  return (
    <>
      <h2>Cart</h2>
      <button className="fixed left-0 top-35 z-50" onClick={handleClearCart}>
        Clear Cart
      </button>
      {items.length > 0 ? (
        <ProductsList products={items} onCart={true} />
      ) : (
        <p className="translate-y-50">Your cart is empty</p>
      )}
    </>
  );
}
