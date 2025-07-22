import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/ReactSpinner";
import { useFarmStore } from "../stores/useFarmStore";
import TypewriterHeading from "../components/TypeWriter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { useAuthStore } from "../stores/useAuthStore";
import ProductsList from "../components/ProductsList";

export default function Cart() {
  const { fetchCart, clearCart, items } = useCartStore();
  const uid = useAuthStore().user?.uid;
  const navigate = useNavigate();
  fetchCart(uid);
  useEffect(() => {
    if (uid) {
      fetchCart(uid);
      console.log(uid);
    } else navigate("/login");
  }, []);

  return (
    <>
      <h2>Cart</h2>
      <button
        onClick={() => {
          if (uid) clearCart(uid);
        }}
      >
        Clear Cart
      </button>
      <ProductsList products={items} onCart={true} />
    </>
  );
}
