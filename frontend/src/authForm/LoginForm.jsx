import { useState } from "react";
import { loginUser } from "../services/auth.js";
import { MdEmail, MdLock } from 'react-icons/md';
import { useNavigate, useOutletContext } from "react-router-dom";

export default function LoginForm(){
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { isLoading, setIsLoading, errorMessage, setErrorMessage } = useOutletContext();
    
    const handleLogin = async(event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        const data = Object.fromEntries(new FormData(event.target).entries());
        const result = await loginUser(data);

        if (result.status === "success") {
            localStorage.setItem("accessToken", result.data.accessToken);
            localStorage.setItem("refreshToken", result.data.refreshToken);
            navigate("/dashboard");
        } else {
            setErrorMessage("Email atau Password salah!");
        }
        setIsLoading(false);
    }

    const inputClass = "w-full bg-white/28 border border-white/0 rounded-xl py-3 pl-10 pr-6 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/50 text-[#0b1e42]";
    const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-white/80";

    return(
        <div className="mt-6">
            <form onSubmit={handleLogin}>
                {errorMessage && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-sm mx-5 mb-4 text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="mx-5 space-y-4">
                    <label htmlFor="email" className="text-white ml-1">
                        Email
                    </label>
                    <div className="relative mt-1">
                        <MdEmail className={iconClass} size={17}/>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                localStorage.setItem("login_email", e.target.value);
                            }}
                            className={inputClass}
                            required/>
                    </div>

                    <div>
                        <label htmlFor="password" className="text-white ml-1">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <MdLock className={iconClass} size={17}/>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                minLength={6}
                                className={inputClass}
                                required/>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center bg-white text-[#0b1e42] rounded-[20px] p-2 mt-8 mb-6 cursor-pointer hover:scale-101 hover:bg-[#A8F3FF] transition active:scale-95 font-bold text-xl"
                            >
                                {isLoading ? "MEMPROSES..." : "LOGIN" }
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}