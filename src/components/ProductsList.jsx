import { useState } from "react";
import TypewriterHeading from "./TypeWriter";
import SlideInMotion from "./SlideInMotion";
import { useInView } from "react-intersection-observer";
import { useCartStore } from "../stores/useCartStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function ({ products, onCart }) {
  const { updateCart, totalQuantity, fetchCart } = useCartStore();
  const [isSelected, setIsSelected] = useState(-1);
  //get UID
  const { user } = useAuthStore();
  const uid = user?.uid;
  const navigate = useNavigate();
  const handleCart = (uid, item, delta, e) => {
    e.stopPropagation();
    if (!uid) navigate("/login");
    updateCart(uid, item, delta);
    fetchCart();
  };

  return (
    <>
      <div className={`grid gap-10 place-items-center w-full md:w-screen`}>
        {products.map((item, index) => {
          const [ref, inView] = useInView({ threshold: 0.5 });
          // TAILWIND styles
          const styles = {
            container: `grid gap-30 place-items-center w-full md:w-screen`,

            card: `snap-start //sticky top-[100px] relative group w-full h-[300px] overflow-hidden cursor-pointer
                    grid grid-cols-1 place-items-center 
                    md:w-1/2 md:grid-cols-2 md:gap-5`,

            overlay: `${
              inView ? "h-[50%] bg-cyan-950 md:w-1/2 md:translate-x-1/2" : ""
            }
                        bg-black h-full w-full absolute opacity-70
                        grid place-items-center transition-all duration-350`,

            text: `${
              inView
                ? "md:opacity-100 opacity-0 group-hover:opacity-100"
                : "opacity-0"
            } 
                    transition-opacity duration-1400`,

            title: `${inView || isSelected === index ? "opacity-0" : ""} 
                      absolute transition duration-1000
                      w-1/2 md:-translate-x-1/2`,

            image: `w-full h-full object-cover group-hover:shadow-[14px_14px_14px_black]`,

            cartBtn: `${inView ? "inline mt-10" : "hidden"} group-hover:inline
                        absolute bottom-0 right-0 scale-70 text-white font-bold rounded-full outline outline-green-500
                        transition-all duration-1400 ease-in-out transform 
                        active:shadow-[0_0_14px_cyan]`,

            details: `absolute md:w-1/2 left-0 bg-black opacity-70 space-y-2 text-left transition-all duration-1400 ease-in-out`,
          };

          return (
            <div
              key={index}
              ref={ref}
              label="show details"
              className={styles.card}
              onClick={() => setIsSelected(index)}
            >
              {/* IMAGE */}
              <img src={item.image} alt={item.name} className={styles.image} />
              <div className={styles.overlay}>
                <p className={styles.text}>{item.description}</p>
                <h3 className={styles.title}>{item.name}</h3>
                {/*  CART BUTTON*/}
                {onCart && (
                  <button
                    className={`${styles.cartBtn} -translate-x-25`}
                    onClick={(e) => handleCart(uid, item, 0, e)}
                  >
                    Remove
                  </button>
                )}
                <button
                  className={styles.cartBtn}
                  onClick={(e) => handleCart(uid, item, 1, e)}
                >
                  Buy now🛒
                </button>
              </div>
              {isSelected === index && (
                <>
                  {" "}
                  {/* DETAILS */}
                  <h3 className={styles.title}>{item.name}</h3>
                  <ul className={styles.details}>
                    <h3>{item.name}</h3>
                    <li>
                      <strong>Availability:</strong> {item.availability}
                    </li>
                    <li>
                      <strong>Certifications:</strong> {item.certifications}
                    </li>
                    <li>
                      <strong>Origin:</strong> {item.origin}
                    </li>
                    <li>
                      <strong>Practices:</strong> {item.pratices}
                    </li>
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
