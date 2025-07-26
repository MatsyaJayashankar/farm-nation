import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Link, NavLink, useNavigate } from "react-router-dom";

const styles = {
  form: "grid gap-3",
  input: "rounded bg-white focus:outline focust:outline-2 text-black",
  button: "rounded w-auto bg-black text-white",
  heading: "text-2xl font-bold mb-4",
  error: "text-red-500 mt-2",
  text: "text-green-500 mt-2",
};

const Login = () => {
  const { login, logout, initAuth, user, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    initAuth();
    emailRef.current?.focus();
    if (user) {
      navigate("/store");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log("Login Success");
      navigate("/store");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="translate-y-1/2">
      <h2 className={styles.heading}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          ref={emailRef}
          value={email}
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button}>Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <Link to="/signup">
        <p className={styles.text}>New user? Signup</p>
      </Link>
    </div>
  );
};

export default Login;
