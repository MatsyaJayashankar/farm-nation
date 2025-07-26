import { NavLink, useLocation } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useState } from "react";

export default function NavButtons() {
  const location = useLocation();
  const [animateQty, setAnimateQty] = useState(false);
  const { totalQuantity } = useCartStore();

  useEffect(() => {
    setAnimateQty(true);
    const timeout = setTimeout(() => setAnimateQty(false), 1500);
    return () => clearTimeout(timeout);
  }, [totalQuantity]);

  const styles = {
    container: `z-50 fixed bottom-0  left-1/2 -translate-x-1/2 
                md:w-10 md:h-1/2 md:gap-5 md:translate-x-0 md:-translate-y-1/2  md:grid  md:top-1/2 md:left-0
                flex bg-black w-[250px] h-[40px] items-center justify-around `,
    button:
      "w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white transition-transform duration-300 ease-in-out hover:-translate-y-1",
    icon: "text-white text-[20px]",
    cartBadge: ` absolute md:relative translate-x-2 -translate-y-7 bg-green-600 text-white text-xs font-medium w-[18px] 
                  h-[18px] flex items-center justify-center rounded-full transition-transform duration-300 
                  ${totalQuantity > 0 ? "inline" : "hidden"}`,
  };

  return (
    <div className={styles.container}>
      <NavLink to="/">
        <svg
          stroke="currentColor"
          className={styles.icon}
          fill={location.pathname === "/" ? "yellow" : "currentColor"}
          strokeWidth="0"
          viewBox="0 0 1024 1024"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
        </svg>
      </NavLink>
      <NavLink
        to="/store"
        style={({ isActive }) => ({ color: isActive ? "yellowgreen" : "" })}
      >
        <svg
          className={styles.icon}
          stroke={location.pathname === "/store" ? "yellow" : "currentColor"}
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </NavLink>
      <NavLink to="/profile">
        <svg
          stroke="currentColor"
          fill={location.pathname === "/profile" ? "yellow" : "currentColor"}
          className={styles.icon}
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path>
        </svg>
      </NavLink>
      <NavLink to="/cart">
        <svg
          stroke={location.pathname === "/cart" ? "yellow" : "currentColor"}
          className={styles.icon}
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span
          className={`${styles.cartBadge}
          ${animateQty ? "animate-ping" : ""}`}
        >
          {totalQuantity}
        </span>
      </NavLink>
    </div>
  );
}
