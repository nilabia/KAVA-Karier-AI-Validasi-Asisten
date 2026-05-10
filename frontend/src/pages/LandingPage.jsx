import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import hp from "../assets/hp.png";

export default function LandingPage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen flex flex-col">
            <header>
                <img src={logo} alt="KAVA | Karier AI Validasi Asisten" className="h-8 ml-6"/>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-0 mt-15">
                <h1 className="text-5xl md:text-5xl font-bold text white max-w-3xl leading-tight mb-6 text-white">
                    Temukan
                    <span className="text-yellow-300"> Karier yang Tepat </span>
                    Mulai dari CV-mu!
                </h1>
                <p className="text-white leading-relaxed">
                    Bingung mau kerja di bidang apa? Tenang, KAVA (Karier AI Validasi Asisten) siap bantu!<br/>
                    Cukup upload <span className="bg-yellow-300 px-2 text-[#0b1e42]">CV ATS-mu</span> dan biarkan AI kami merekomendasikan role karier yang paling cocok buat kamu.
                </p>
                <button
                onClick={() => navigate("/auth")}
                className="text-white bg-gradient-to-b from-blue-900 to-blue-400 border-2 rounded-2xl p-2 px-4 my-8 shadow-md hover:shadow-[0_0_30px_#00ccff] hover:scale-105 active:scale-95 hover:shadow-blue-500/50 transition duration-300 ease-out">
                    Mulai Sekarang →
                </button>

                <div className="w-full max-w-3xl mx-auto mt-3">
                    <img src={hp} className="w-full h-auto object-contain"/>
                </div>
            </main>
        </div>    
    )
}