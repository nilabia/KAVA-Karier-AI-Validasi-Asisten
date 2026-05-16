import { useState, useEffect } from "react";
import { registerUser, verifyEmail } from "../services/auth.js";
import { MdCheckCircle, MdEmail, MdLock, MdPerson } from 'react-icons/md';
import { useNavigate, useOutletContext } from "react-router-dom";

export default function RegisterForm(){
    const { step, setStep, isLoading, setIsLoading, isGoogleLoading, errorMessage, setErrorMessage } = useOutletContext();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedRegister = localStorage.getItem("pendingRegister");
        if (savedRegister) {
            const parsed = JSON.parse(savedRegister);
            setFormData(parsed.formData);
            setStep(parsed.step);
        }
    }, []);

    const handleChange = (e) => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const handleRegister = async (event) => {
        event.preventDefault();
        if (isLoading || isGoogleLoading)
            return;
        
        const { name, email, password, confirmPassword } = formData;
        
        if (password !== confirmPassword) {
            return setErrorMessage("Password dan konfirmasi password harus sama!");
        } 
        setIsLoading(true);
        const result = await registerUser({
            name,
            email,
            password
        });
        
        if(result.status === "success") {
            localStorage.setItem("pendingRegister", 
                JSON.stringify({
                    formData, 
                    step: 2
                })
            );
            setStep(2);
        } else {
            setErrorMessage(result.message);
        }
        setIsLoading(false);
    };

    const handleVerify = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        const code = event.target.code.value;

        setIsLoading(true);
        const result = await verifyEmail({ 
            email: formData.email,
            code: code
        });
        
        if (result.status === "success") {
            localStorage.removeItem("pendingRegister");
            navigate("/auth/login");
        } else {
            setErrorMessage(result.message);
        }
        setIsLoading(false);
    };

    const inputClass = "w-full bg-white/28 border border-white/0 rounded-xl py-3 pl-10 pr-6 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/50 text-[#0b1e42]";
    const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-white/80";

    return ( 
        <div className="mt-6">
            <form onSubmit={step === 1 ? handleRegister : handleVerify}>
                {errorMessage && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-sm mx-5 mb-4 text-center">
                        {errorMessage}
                    </div>
                )}
                <div className="mx-5 space-y-4">
                            <div>
                                <label htmlFor="name" className="text-white ml-1">
                                    Nama Lengkap
                                </label>
                                <div className="relative mt-1">
                                    <MdPerson className={iconClass} size={17}/>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClass}
                                        readOnly={step === 2}
                                        required={step === 1}/>
                                        {step === 2 && (
                                            <MdCheckCircle
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300"
                                            size={17} />
                                        )}
                                </div>
                            </div>
                            <div className="mt-3">
                                <label htmlFor="email" className="text-white ml-1">
                                    Email
                                </label>
                                <div className="relative mt-1">
                                    <MdEmail className={iconClass} size={17}/>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputClass}
                                        readOnly={step === 2}
                                        required={step === 1}/>
                                        {step === 2 && (
                                            <MdCheckCircle
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300"
                                            size={17} />
                                        )}
                                </div>
                            </div>
                            <div className="mt-3">
                                <label htmlFor="password" className="text-white ml-1">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <MdLock className={iconClass} size={17}/>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        minLength={8}
                                        className={inputClass}
                                        onChange={handleChange}
                                        readOnly={step === 2}
                                        required={step === 1}
                                        />
                                        {step === 2 && (
                                            <MdCheckCircle
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300"
                                            size={17} />
                                        )}
                                </div>
                            </div>
                            <div className="mt-3">
                                <label htmlFor="confirmPassword" className="text-white ml-1">
                                    Konfirmasi Password
                                </label>
                                <div className="relative mt-1">
                                    <MdLock className={iconClass} size={17}/>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        minLength={8}
                                        className={inputClass}
                                        onChange={handleChange}
                                        disabled={step === 2}
                                        required={step === 1}
                                        />
                                        {step === 2 && (
                                            <MdCheckCircle
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300"
                                            size={17} />
                                        )}
                                </div>
                            </div>

                        {step === 2 && (
                            <div className="w-full relative my-2">
                                <p className="text-green-300 text-xs text-center">
                                    Data berhasil disimpan, email verifikasi telah di kirim.
                                </p>

                                <p className="text-center mt-4 text-[10px] text-white/80 tracking-widest font-medium">
                                MASUKKAN KODE VERIFIKASI</p>
                                <div className="flex justify-center mt-2">
                                    <input name="code"
                                    type="text"
                                    className="text-center bg-white/28 border border-white/0 rounded-xl py-1.5 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/50 text-[#0b1e42]"
                                    required/>                                     
                                </div>
                            </div>
                        )}

                    <div className="mx-5">
                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full flex items-center justify-center bg-white text-md text-[#0b1e42] rounded-[20px] p-2 mt-8 mb-6 cursor-pointer hover:scale-101 hover:bg-[#A8F3FF] transition active:scale-95 font-bold text-xl"
                        >
                        {isLoading ? "Memproses..." : step === 1 ? "LANJUTKAN" : "REGISTER"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}