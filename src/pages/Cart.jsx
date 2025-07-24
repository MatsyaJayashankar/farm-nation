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
    } else navigate("/login");
  }, [uid, navigate]);

  const handleClearCart = () => {
    if (uid) {
      clearCart(uid);
      fetchCart(uid);
    }
  };

  return (
    <>
      <h2>Cart</h2>
      <button onClick={handleClearCart}>Clear Cart</button>
      <ProductsList products={items} onCart={true} />
    </>
  );
}
