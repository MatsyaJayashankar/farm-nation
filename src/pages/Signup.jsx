import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
const styles = {
  form: "grid gap-3",
  input: "rounded bg-white focus:outline focust:outline-2 text-black",
  button: "rounded w-auto bg-black text-white",
  heading: "text-2xl font-bold mb-4",
  error: "text-red-500 mt-2",
  text: "text-green-500 mt-2",
};
const Signup = () => {
  const { signup, login, logout, initAuth, user, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      signup(email, password); //Zustand
      console.log("signup Success");
      navigate("/store");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="translate-y-1/2">
      <h2 className={styles.heading}>Signup</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          className={styles.input}
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          className={styles.input}
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button}>Signup</button>
      </form>
      {error ? <p>{error}</p> : null}
      <Link to="/login">
        <p className={styles.text}>Already registered?Login</p>
      </Link>
    </div>
  );
};

export default Signup;
