import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useAuthStore } from "../stores/useAuthStore";
import ProductCard from "./ProductCard";

export default function ProductsList({ products, onCart }) {
  const { updateCart, fetchCart } = useCartStore();
  const [isSelected, setIsSelected] = useState(false);

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const uid = user?.uid;

  const handleCart = async (item, delta, e) => {
    e.stopPropagation();
    if (uid) {
      await updateCart(uid, item, delta);
      await fetchCart(uid);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className={`grid place-items-center 
      ${
        onCart
          ? "bg-neutral-900 p-5 gap-2 "
          : " w-full md:w-screen gap-10 snap-x snap-mandatory overflow-x-auto p-4"
      }
    `}
    >
      {products.map((item, index) => (
        <ProductCard
          key={item.id || index}
          item={item}
          index={index}
          onCart={onCart}
          handleCart={handleCart}
          isSelected={isSelected === index}
          setIsSelected={setIsSelected}
        />
      ))}
    </div>
  );
}
