import { useEffect, useRef, useState } from "react";
import TypewriterHeading from "../components/TypeWriter";
import { useFarmStore } from "../stores/useFarmStore";
import ProductsList from "../components/ProductsList";
import Loader from "../components/ReactSpinner";
import { useCartStore } from "../stores/useCartStore";
import { useFormStatus } from "react-dom";

export default function Store() {
  const { fetchProducts, products, loading, error } = useFarmStore();
  const { fetchCart } = useCartStore();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(null);
  const searchRef = useRef(null);

  const { pending } = useFormStatus();

  useEffect(() => {
    fetchProducts();
    fetchCart(); // if needed
  }, []);

  useEffect(() => {
    searchRef.current?.focus();
    setFilteredProducts(
      products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    );
    setShowDropdown(query.length > 0);
  }, [products, query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <Loader text="Store" />;

  return (
    <div className="grid gap-5 place-items-center">
      <form
        ref={ref}
        onSubmit={(e) => e.preventDefault()}
        className="z-50 sticky top-14 translate-y-5 opacity-70"
      >
        <input
          type="text"
          ref={searchRef}
          value={query}
          placeholder="Search 🔍"
          className="bg-gray-950 p-3 outline shadow outline-green-800 rounded-md focus:outline-cyan-800 focus:shadow-[0_0_7px_cyan]"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (pending) return;
            const total = filteredProducts.length;
            if (e.key === "Escape") {
              setQuery("");
              setShowDropdown(false);
              setActiveIndex(-1);
            } else if (e.key === "Enter") {
              if (activeIndex >= 0 && activeIndex < total) {
                setQuery(filteredProducts[activeIndex].name);
                setShowDropdown(false);
                setActiveIndex(-1);
              }
            } else if (e.key === "ArrowDown") {
              setActiveIndex((prev) => (prev + 1) % total);
            } else if (e.key === "ArrowUp") {
              setActiveIndex((prev) => (prev - 1 + total) % total);
            }
          }}
        />
        {showDropdown && filteredProducts.length > 0 && (
          <ul className="absolute mt-2 w-full bg-gray-950 z-10 max-h-60 overflow-y-auto rounded-md shadow">
            {filteredProducts.map((p, index) => (
              <li
                key={p.id}
                className={`p-3 cursor-pointer text-gray-500 ${
                  activeIndex === index
                    ? "bg-green-800 text-white shadow"
                    : "hover:shadow hover:text-white"
                }`}
                onClick={() => {
                  setQuery(p.name);
                  setShowDropdown(false);
                  setActiveIndex(-1);
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className="fixed top-17 left-0 z-50">
      </div>
      <ProductsList products={filteredProducts} page="store" />
      <TypewriterHeading text="Store" />
    </div>
  );
}
