import React from 'react';
import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { registerUser, verifyEmail, loginUser, loginWithGoogle } from "../services/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FcGoogle } from 'react-icons/fc';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';

export default function AuthPage({ type = "signin" }) {
    const [tab, setTab] = useState(type === "signin" ? "login" : "register");
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const switchTab = (newTab) => {
        setTab(newTab);
        setStep(1);
        setErrorMessage("");
    }

    const googleLoginHandle = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const result = await loginWithGoogle(tokenResponse.id_token);

                if(result.status === "success") {
                    localStorage.setItem("accessToken", result.data.accessToken);
                    localStorage.setItem("refreshToken", result.data.refreshToken);
                    navigate("/dashboard");
                } else {
                    setErrorMessage(result.message);
                }
            } catch(error) {
                    setErrorMessage("Gagal login  Google.");
            } finally {
                setIsLoading(false);
            }
        }, onError: () => setErrorMessage("Proses login Google dibatalkan.")
    });

    const handleLogin = async(event) => {
        event.preventDefault();
        setErrorMessage("");

        const data = Object.fromEntries(new FormData(event.target).entries());

        setIsLoading(true);
        try{
            const result = await loginUser({
                email: data.email,
                password: data.password
            });
            if(result.status === "success") {
                localStorage.setItem("accessToken", result.data.accessToken);
                localStorage.setItem("refreshToken", result.data.refreshToken);
                navigate("/dashboard");
            } else {
                if (
                    result.message === "Account not verified. Please check your email."
                ) {
                    setErrorMessage("Akun belum diverifikasi. Masukkan kode verifikasi.");
                    setEmail(data.email);
                    setTab("register");
                    setStep(2);
                } else {
                    setErrorMessage("Email atau password salah.");
                }
            }
        } catch(error) {
            console.error(error);
            setErrorMessage("Terjadi kesalahan koneksi ke server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async(event) => {
        event.preventDefault();
        setErrorMessage("");

        const data = Object.fromEntries(new FormData(event.target).entries());

        if(data.password !== data.confirmPassword) {
            setErrorMessage("Password dan konfirmasi password harus sama!");
            return;
        }

        setIsLoading(true);
        try {
            const result = await registerUser({
                name: data.name,
                email: data.email,
                password: data.password
            });
            if (result.status === "success") {
                setEmail(data.email);
                setStep(2);
            } else {
                setErrorMessage(result.message);
            }
        } catch(error){
            console.error(error);
            setErrorMessage("Terjadi kesalahan koneksi ke server.");
        } finally {
            setIsLoading(false);
        }
    }
    const handleVerify = async(event) => {
        event.preventDefault();
        setErrorMessage("");

        const data = Object.fromEntries(new FormData(event.target).entries());

        setIsLoading(true);
        try{
            const result = await verifyEmail({
                email: email,
                code: data.code
            });
            if (result.status === "success") {
                switchTab("login");
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Terjadi kesalahan koneksi ke server.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(tab === "login"){
            handleLogin(event);
        } else {
            step === 1 ? handleRegister(event) : handleVerify(event);
        }
    };


    const inputClass = "w-full bg-white/28 border border-white/0 rounded-xl py-3 pl-10 pr-6 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/50 text-[#0b1e42]";
    const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-white/80";

    return (
        <GoogleOAuthProvider clientId = { clientId }>        
            <div className="min-h-full flex flex-col">
                <header>
                    <img src={logo} alt="KAVA | Karier AI Validasi Asisten" className="h-8" style={{marginLeft:"23px"}}/>
                </header>
            
                <div className="w-full flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-gray/30 backdrop-blur-md rounded-[20px] shadow-2xl border border-white/5 p-4 my-6">
                        
                        <div className="flex border-[1.5px] border-white rounded-xl mt-6 mx-5 p-1">
                            <button onClick={() => switchTab("login")} className={`flex-1 py-2 rounded-lg font-semibold text-2xl ${tab === "login" ? "bg-white text-[#0b1e42]" : "text-white"}`}>LOGIN</button>
                            <button onClick={() => switchTab("register")} className={`flex-1 py-2 rounded-lg font-semibold text-2xl ${tab === "register" ? "bg-white text-[#0b1e42]" : "text-white"}`}>REGISTER</button>
                        </div>
                        
                        {errorMessage && (
                            <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-1 rounded-lg text-sm mx-5 my-3 text-center">
                                {errorMessage}
                            </div>
                        )}

                        <div className="w-full flex items-center justify-center">
                            <button
                            type="button"
                            onClick={() => googleLoginHandle()}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-white rounded-[20px] p-2.5 mx-5 mt-4 cursor-pointer hover:scale-101 hover:bg-[#A8F3FF] transition">
                                <FcGoogle size={20}/>
                                <span>Masuk dengan Google</span>
                            </button>
                        </div>

                        <form onSubmit={ handleSubmit } key={tab}>
                            {tab === "login" && step === 1 && (
                                <div className="relative flex items-center justify-center mt-10 mb-7">
                                    <div className="flex-1 h-px bg-white/30 ml-5 mr-30"></div>
                                    <span className="absolute px-4 text-[10px] text-white/80 tracking-widest font-medium">
                                        ATAU EMAIL
                                    </span>
                                    <div className="flex-1 h-px bg-white/30 mr-5"></div>
                                </div>     
                            )}
                            
                            <div>
                                {tab === "register" && (
                                    <div className="mx-5 mt-6">
                                        <label htmlFor="text" className="text-white ml-1">Nama Lengkap</label>
                                        <div className="relative mt-1">
                                            <MdPerson className={iconClass} size={17}/>
                                            <input id="name" name="name" type="text"
                                            className={inputClass} required/>
                                        </div>
                                    </div>
                                )}

                                <div className="mx-5 mt-5">
                                    <label htmlFor="email" className="text-white ml-1">Email</label>
                                        <div className="relative mt-1">
                                            <MdEmail className={iconClass} size={17}/>
                                            <input id="email" name="email" type="email"
                                            className={inputClass} required/>
                                        </div>
                                    </div>

                                <div className="mx-5 mt-3">
                                    <label htmlFor="password" className="text-white ml-1">Password</label>
                                        <div className="relative mt-1">
                                            <MdLock className={iconClass} size={17}/>
                                            <input id="password" name="password" type={showPassword ? "text" : "password"} minLength={6}
                                            className={inputClass} required/>
                                        </div>
                                    </div>

                                    {tab === "register" && (
                                        <div className="mx-5 mt-3">
                                        <label htmlFor="password" className="text-white ml-1">Konfirmasi Password</label>
                                            <div className="relative mt-1">
                                                <MdLock className={iconClass} size={17}/>
                                                <input id="confirmPassword" name="confirmPassword" type="password" minLength={6}
                                                className={inputClass} required/>
                                            </div>
                                        </div>
                                    )}

                                {tab === "register" && step === 2 && (
                                    <div className="w-full relative my-2">
                                        <p className="text-center mt-5 text-[10px] text-white/80 tracking-widest font-medium">
                                        MASUKKAN KODE VERIFIKASI</p>
                                        <div className="flex justify-center mt-2">
                                            <input name="code"
                                            type="text"
                                            className="text-center bg-white/28 border border-white/0 rounded-xl py-1.5 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/50 text-[#0b1e42]"
                                            required/>                                     
                                        </div>
                                    </div>
                                )}
                            </div>
                            

                            <div className="mx-5">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center bg-white rounded-[20px] p-2 mt-8 mb-6 cursor-pointer hover:scale-101 hover:bg-[#A8F3FF] transition font-semibold text-xl"
                                >
                                {isLoading ? "MEMPROSES..."
                                : tab === "login"
                                    ? "LOGIN"
                                    : step === 1
                                        ? "LANJUTKAN"
                                        : "REGISTER"
                                }
                                </button>
                            </div>
                        </form>
                </div>
            </div>  
        </div>
    </GoogleOAuthProvider>
)};