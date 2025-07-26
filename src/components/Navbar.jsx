import {
  Link,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
// Navbar.jsx
import React, { useRef, useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const { user, logout, balance } = useAuthStore();
  const [animateQty, setAnimateQty] = useState(false);
  const { totalQuantity } = useCartStore();
  const location = useLocation();
  useEffect(() => {
    setAnimateQty(true);
    const timeout = setTimeout(() => setAnimateQty(false), 1500);
    return () => clearTimeout(timeout);
  }, [totalQuantity]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Store", path: "/store" },
    { label: "Cart", path: "/cart" },
  ];

  const styles = {
    header: `h-[clamp(50px,14vh,200px)] group  fixed grid place-items-center top-0 left-0 w-full z-50 p-4
             transition-all duration-350 ease-in-out
             ${
               location.pathname === "/store"
                 ? "hover:bg-gray-800 text-black hover:text-white"
                 : "bg-transparent text-white"
             }
              hover:bg-white-800 `,

    walletBadge: `${user ? "inline" : "hidden"}  fixed top-7 left-4 z-50 
                cursor-pointer active:scale-210 flex items-center justify-center gap-2 `,

    balance: `inline h-[18px] flex justify-center items-center
           scale-70 bg-green-600 text-white text-xs font-medium  rounded transition-transform duration-300
           ${animateQty ? "animate-ping" : ""}`,

    logo: ` text-[clamp(1rem,5vw,2.5rem)] tracking-[0.4em] mx-2 `,

    menuButton: `bg-transparent md:hidden absolute top-0 right-0 z-50 text-2xl cursor-pointer pt-2 pr-2`,

    desktopNav: `hidden p-10 md:flex justify-around items-center gap-3 w-80 relative -top-2 h-10
                 bg-gray-800 opacity-20 text-xs shadow
                 group-hover:translate-y-10 group-hover:opacity-100 group-hover:w-80 group-hover:text-base
                 transition-all duration-350 ease-in-out`,

    mobileMenu: `absolute top-0 right-0 w-50 h-auto z-40 will-change-transform
                 flex flex-col gap-7 py-15 md:hidden bg-gray-800 text-2xl
                 shadow rounded-2xl
                 transition-transform duration-500 ease-in-out m-2`,

    mobileNavLink: `hover:shadow-[0_0_2px] active:shadow-[0_0_2px]
                    rounded p-2`,

    button: `absolute left-0 top-20`,
    loginBtn: ` fixed right-2 top-3 z-50  text-white`,
  };

  return (
    <header className={styles.header}>
      <Link to="/cart" className={styles.walletBadge} role="button">
        💳<p className={styles.balance}>{balance}</p>
      </Link>
      <h3 className={styles.logo}>FARM NATION</h3>

      <Link
        to={`${user ? "/" : "/login"}`}
        className={styles.login}
        onClick={() => {
          if (user) logout();
        }}
      >
        <p className={styles.loginBtn}>{user ? "Logout" : "Login"}</p>
      </Link>

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
    </header>
  );
};

export default Navbar;
