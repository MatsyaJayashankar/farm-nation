import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { toast } from "sonner";
import { ErrorBoundary } from "./ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

function setupGlobalErrorHandler() {
  window.addEventListener("unhandledrejection", (event) => {
    toast.error(
      `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`
    );
    console.error("Unhandled rejection:", event.reason);
  });

  window.onerror = (message, source, lineno, colno, error) => {
    toast.error(`JS Error: ${message}`);
    console.error("Window error:", { source, lineno, colno, error });
  };
}
setupGlobalErrorHandler();
