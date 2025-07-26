import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { h4, li } from "framer-motion/client";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const uid = user?.uid;
  const { orders } = useCartStore();
  console.log(new Date(Date.now()).toISOString().split("T")[0]);
  const orderStatus = ["pending", "processing", "shipped", "delivered"];
  const [selected, setSelected] = useState(-1);
  // console.log(serverTimestamp().toDate().toLocaleString());

  console.log(orders);
  return (
    <div className="translate-y-5 md:translate-y-0 md:flex grid gap-4 p-2">
      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 space-y-6 text-gray-800 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>
        <div className="space-y-2 text-left">
          <p className="text-lg font-semibold">
            Name: <span className="font-normal">{user?.displayName}</span>
          </p>
          <p className="text-lg font-semibold">
            Email: <span className="font-normal">{user?.email}</span>
          </p>
        </div>
        <button className="w-full px-4  rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-200">
          Update Email
        </button>

        <button className="w-full px-4  rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition duration-200">
          Recharge Wallet
        </button>

        {user && (
          <button
            className="w-full px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition duration-200"
            onClick={() => logout()}
          >
            Logout
          </button>
        )}
              {!user && (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
      </div>

      <div>
        ORDERS
        <ul className="group grid gap-2 opacity-70">
          {orders?.map((order, index) => (
            <div
              key={index}
              className="flex bg-white gap-2 text-black rounded-2xl p-2 cursor-pointer"
              onClick={() =>
                setSelected((prev) => (prev === index ? -1 : index))
              }
            >
              {selected === index ? "-" : "+"}

              <ul className="grid gap-2 text-left w-full">
                {order.items?.map((item, idx) => (
                  <li key={idx}>{item.name}</li>
                ))}

                {selected === index && (
                  <ul>
                    <li>
                      <strong>Total: ₹ </strong> {order.total}
                    </li>
                    <li>
                      <strong>ordered on:</strong>
                      {order.date.toDate().toLocaleDateString("en-US", {
                        weekday: "short", // "Saturday"
                        year: "numeric", // "2025"
                        month: "short", // "July"
                        day: "numeric", // "26"
                      })}
                    </li>
                  </ul>
                )}
              </ul>
              <div className="grid gap-2 text-right bg-gray-800 rounded-2xl p-2 text-gray-400">
                {selected === index ? (
                  orderStatus.map((status) => (
                    <h4
                      className={`${
                        status === order.status ? "text-green-500" : ""
                      }`}
                    >
                      {status}
                    </h4>
                  ))
                ) : (
                  <h4 className="text-green-500">{order.status}</h4>
                )}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
