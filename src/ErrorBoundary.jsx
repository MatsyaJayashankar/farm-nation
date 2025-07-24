import { Component } from "react";
import { toast } from "sonner";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    toast.error(`Unexpected Error: ${error.message}`);
    console.error("Caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong ⚠️</h2>;
    }
    return this.props.children;
  }
}
