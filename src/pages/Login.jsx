import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const Login=()=>{
    const{signup,login,logout,initAuth,user,error} = useAuthStore();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("");

    const navigate = useNavigate();
    useEffect(()=>{
        initAuth();
        if(user){
            navigate('/store');
        }
    },[]);
    
    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            login(email,password);//Zustand
            console.log("Login Success");
            navigate('/store');
        } catch (error) {
            console.log(error);
        }
    };

    return(
        <>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="grid gap-3"
        >
            <input type="email" value={email} className="rounded bg-white text-black" placeholder="Email" required 
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input type="password" value={password} className="rounded bg-white text-black" placeholder="Password" required 
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button className="rounded w-auto bg-black text-white">Login</button>
        </form>
        {error? <p>{error}</p>:null}
        </>
    )
};

export default Login;