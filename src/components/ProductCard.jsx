import { useState } from "react";
import { useInView } from "react-intersection-observer";

export default function ProductCard({
  item,
  index,
  onCart,
  handleCart,
  isSelected,
  setIsSelected,
}) {
  const [ref, inView] = useInView({ threshold: 0.5 });

  const styles = {
    card: `snap-start relative group  overflow-hidden cursor-pointer shadow-md md:gap-5
           ${
             onCart
               ? "w-100 h-20  bg-neutral-900 p-4 rounded-xl"
               : "w-full h-[300px] md:w-1/2 grid grid-cols-1 place-items-center  "
           }`,

    overlay: `${
      inView && !onCart ? "h-[50%] bg-cyan-950 md:w-1/2 md:translate-x-1/2" : ""
    }
          ${
            onCart
              ? "flex items-center justify-between w-full h-full"
              : "bg-black h-full w-full absolute opacity-70 grid place-items-center transition-all duration-350"
          }`,

    text: `${
      inView && !onCart && !isSelected
        ? "md:opacity-100 opacity-0 group-hover:opacity-100"
        : "hidden"
    }
           transition-opacity duration-1400`,

    title: `${inView || isSelected ? "opacity-0" : ""}
            absolute transition duration-2100 md:duration-700
            w-1/2 md:-translate-x-1/2`,

    image: `object-cover
            ${
              onCart
                ? " w-20 h-20 p-2 rounded-md opacity-90"
                : "w-full h-full  group-hover:shadow-[14px_14px_14px_black]"
            }`,
    button: `text-white font-bold rounded-full outline outline-green-500 scale-75
         transition-all duration-1400 ease-in-out transform active:shadow-[0_0_14px_cyan]
         px-4 py-2 bg-green-800 hover:bg-green-700 focus:outline-none`,

    cartBtn: `group-hover:inline"
              absolute bottom-0 right-0 scale-75 text-white font-bold rounded-full outline outline-green-500
              transition-all duration-1400 ease-in-out transform
              active:shadow-[0_0_14px_cyan]
              ${onCart ? "inline" : inView ? "inline mt-10" : "hidden"}`,
    price: `absolute bottom-10 right-4  ${
      inView ? "" : "text-green-600"
    } group-hover:text-yellow-400`,
    details: `absolute md:w-1/2 left-0 bg-black opacity-70 space-y-2 text-left transition-all duration-1400 ease-in-out
              ${onCart ? "hidden text-sm p-4 rounded-md" : ""}`,
  };

  return (
    <div
      ref={ref}
      label="show details"
      className={styles.card}
      onClick={() => setIsSelected((prev) => (prev === index ? -1 : index))}
      onDoubleClick={(e) => handleCart(item, 1, e)}
    >
      <img src={item.image} alt={item.name} className={styles.image} />

      <div className={styles.overlay}>
        <p className={styles.text}>{item.description}</p>
        <h3 className={styles.title}>{item.name}</h3>
        {onCart && (
          <div className="flex items-center gap-2 ml-auto absolute top-10 right-0">
            <button
              className={styles.button}
              onClick={(e) => handleCart(item, 0, e)}
            >
              Remove
            </button>
            <button
              className={styles.button}
              onClick={(e) => handleCart(item, -1, e)}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              className={styles.button}
              onClick={(e) => handleCart(item, 1, e)}
            >
              +
            </button>
          </div>
        )}
        <span class={styles.price}>{item.price}</span>{" "}
        {!onCart && (
          <button
            className={styles.cartBtn}
            onClick={(e) => handleCart(item, 1, e)}
          >
            Buy now 🛒
          </button>
        )}
      </div>

      {isSelected && !onCart && (
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
      )}
    </div>
  );
}
