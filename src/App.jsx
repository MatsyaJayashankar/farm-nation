import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MouseTrail from "./components/MouseTrail";
import { useEffect } from "react";
import { useCartStore } from "./stores/useCartStore";
import { useAuthStore } from "./stores/useAuthStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { Toaster } from "sonner";
import NavButtons from "./components/NavButtons";

function App() {
  const { fetchCart } = useCartStore();
  const { user, setUser } = useAuthStore(); // Get setUser from auth store

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) fetchCart(user.uid);
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <>
      <MouseTrail />
      <div className="fixed w-full z-10 top-[50px] left-1/2 transform -translate-x-1/2 scale-50 md:scale-100"></div>
      <Toaster richColors position="bottom-left" />
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
