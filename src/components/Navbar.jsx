import { Link, NavLink } from "react-router-dom";
// Navbar.jsx
import React, { useRef, useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateQty, setAnimateQty] = useState(false);
  const menuRef = useRef();
  const { totalQuantity,fetchCart,clearCart } = useCartStore();

  useEffect(() => {
    setAnimateQty(true);
    const timeout = setTimeout(() => setAnimateQty(false), 300);
    return () => clearTimeout(timeout);
  }, [totalQuantity,clearCart]);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Store", path: "/store" },
    { label: "Cart", path: "/cart" },
    // { label: 'About', path: '/about' },
    // { label: 'Contact', path: '/contact' },
    { label: "Login", path: "/login" },
    { label: "Signup", path: "/signup" },
  ];

  const styles = {
    header: `group fixed grid place-items-center top-0 left-0 w-full z-50 text-white p-4
             transition-all duration-350 ease-in-out`,

    cartBadge: `fixed top-7 left-4  z-50 scale-140  scale-200 cursor-pointer active:scale-210`,
    qty: `fixed -right-2 -top-4 bg-cyan-950 shadow rounded-full w-5 h-5 scale-70
          ${
            animateQty ? "animate-bounce shadow-[0_0_7px_cyan] scale-100" : ""
          }transition-all duration-1000`,

    logo: `text-[clamp(1rem,5vw,2.5rem)] tracking-[0.4em] mx-2`,

    menuButton: `bg-transparent md:hidden absolute top-0 right-0 z-50 text-2xl cursor-pointer pt-2`,

    desktopNav: `hidden p-10 md:flex justify-around items-center gap-3 w-80 relative -top-2 h-10
                 bg-gray-800 opacity-20 text-xs shadow
                 group-hover:translate-y-10 group-hover:opacity-100 group-hover:w-80 group-hover:text-base
                 transition-all duration-350 ease-in-out`,

    mobileMenu: `flex flex-col gap-7 py-15 md:hidden bg-gray-800 text-2xl
                 shadow rounded-2xl
                 transition-transform duration-500 ease-in-out
                 absolute top-0 right-0 w-50 h-screen z-40 will-change-transform`,

    mobileNavLink: `hover:shadow-[0_0_2px] active:shadow-[0_0_2px]
                    rounded-lg p-2`,
  };

  return (
    <header className={styles.header}>
      <Link to="/cart" className={styles.cartBadge} role="button">
        🛒<p className={styles.qty}>{totalQuantity}</p>
      </Link>
      <h3 className={styles.logo}>FARM NATION</h3>
      <h2 onClick={() => setIsOpen(!isOpen)} className={styles.menuButton}>
        {isOpen ? "✖" : "☰"}
      </h2>

      <nav className={styles.desktopNav}>
        {navItems.map(({ label, path }) => (
          <NavLink
            key={label}
            to={path}
            style={({ isActive }) =>
              isActive ? { color: "white" } : { color: "yellowgreen" }
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* mobile */}
      <div
        ref={menuRef}
        className={`${styles.mobileMenu} ${
          isOpen ? "translate-x-0" : "translate-x-100"
        }`}
      >
        {navItems.map(({ label, path }) => (
          <NavLink
            key={label}
            to={path}
            style={({ isActive }) =>
              isActive ? { color: "white" } : { color: "yellowgreen" }
            }
            className={styles.mobileNavLink}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
