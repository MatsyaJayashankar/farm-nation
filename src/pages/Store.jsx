import { useEffect } from "react";
import TypewriterHeading from "../components/TypeWriter";
import { useFarmStore } from "../stores/useFarmStore";
import ProductsList from "../components/ProductsList";
import Loader from "../components/ReactSpinner";
import { useCartStore } from "../stores/useCartStore";

export default function Store() {
  const { fetchProducts, products, loading, error } = useFarmStore();
  const {fetchCart} = useCartStore()

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <Loader text="Store" />;

  return (
    <>
      <TypewriterHeading text="Store" className="absolute left-0" />
      <ProductsList products={products} page={"store"} />
      <TypewriterHeading text="Store" />
    </>
  );
}
