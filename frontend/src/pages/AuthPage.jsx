import { useEffect, useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { loginWithGoogle } from '../services/auth';
import { FcGoogle } from 'react-icons/fc';
import GoogleButton from "../components/GoogleButton";
import PropTypes from "prop-types";

export default function AuthPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sessionMessage, setSessionMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoogleSuccess = async (credentialResponse) => {
        if (isGoogleLoading || isLoading) return;

        setIsGoogleLoading(true);
        setErrorMessage("");
        try {
            const result = await loginWithGoogle(credentialResponse.credential);
    
            if(result.status === "success") {
                localStorage.setItem("accessToken", result.data.accessToken);
                localStorage.setItem("refreshToken", result.data.refreshToken);
                navigate("/dashboard");
            } else {
                setErrorMessage(result.message || "Gagal login dengan Google.");
            } 
        } catch (error) {
            setErrorMessage("Terjadi kesalahan koneksi ke server.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    useEffect(() => {
        const message = localStorage.getItem("sessionMessage");

        if (message) {
            setSessionMessage(message);
            localStorage.removeItem("sessionMessage");
        }
    }, []);

    useEffect(() => {
        setStep(1);
        setErrorMessage("");
    }, [location.pathname]);

    return (         
        <div className="w-full flex-1 flex items-center justify-center p-6 mt-5">
            <div className="w-full max-w-md bg-gray-500/10 backdrop-blur-md rounded-[20px] shadow-2xl shadow-[#0b1e42] border border-white/5 p-4 my-6">
                {sessionMessage && (
                    <div className="mx-5 mt-4 bg-amber-100 border border-amber-300 text-amber-700 px-4 py-3 rounded-xl text-sm font-semibold text-center">
                        {sessionMessage}
                    </div>
                )}

                <div className="flex border-[1.5px] border-white rounded-xl mt-6 mx-5 p-1">
                    <NavLink
                        to="/auth/login"
                        className={({ isActive }) =>
                            `flex-1 py-2 rounded-lg font-bold text-2xl text-center ${isActive ? "bg-white text-[#0b1e42]" : "text-white"}`
                        }
                    >
                        LOGIN
                    </NavLink>

                    <NavLink
                        to="/auth/register"
                        className={({ isActive }) => 
                        `flex-1 py-2 rounded-lg font-bold text-2xl text-center ${isActive ? "bg-white text-[#0b1e42]" : "text-white"}`}
                    >
                        REGISTER
                    </NavLink>
                </div>
                
                <div className="mt-6 px-5">
                    <div className="w-full flex items-center justify-center relative h-[46px]">
                        
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            <GoogleButton 
                                text={isGoogleLoading ? "Memproses..." : "Continue with Google"} 
                                disabled={isLoading || isGoogleLoading}
                            />
                        </div>

\                        <div className={`absolute inset-0 opacity-0 z-10 flex justify-center items-center
                            ${(isLoading || isGoogleLoading) ? "pointer-events-none" : "cursor-pointer"}`}
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}  
                                onError={() => setErrorMessage("Login Google gagal.")}
                                useOneTap={false} 
                                width="375" 
                                disabled={isLoading || isGoogleLoading}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="relative flex items-center justify-center mt-10 mb-7">
                        <div className="flex-1 h-px bg-white/30 ml-5 mr-24"></div>
                        <span className="absolute px-4 text-[10px] text-white/80 tracking-widest font-medium bg-transparent">
                            ATAU EMAIL
                        </span>
                        <div className="flex-1 h-px bg-white/30 mr-5"></div>
                    </div>
                </div>

                <Outlet 
                    context={{ 
                        step,
                        setStep,
                        isLoading,
                        setIsLoading,
                        isGoogleLoading,
                        setIsGoogleLoading,
                        errorMessage,
                        setErrorMessage
                    }}
                />
            </div> 
        </div>
    );
}