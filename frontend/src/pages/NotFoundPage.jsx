import { MdErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            <div className="w-full max-w-md bg-gray-600/10 backdrop-blur-md rounded-[20px] shadow-2xl shadow-[#0b1e42] border border-white/5 p-12 text-center transition-all duration-300">
                <div className="flex justify-center text-red-400 animate-bounce duration-1000">
                    <MdErrorOutline size={100}/>
                </div>

                <h1 className="text-7xl font-extrabold tracking-widest text-red-400">
                    404
                </h1>
                <h2 className="text-xl font-semibold mt-3 text-gray-200">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="text-sm text-gray-400 mt-3 px-4 leading-relaxed">
                    Maaf, halaman yang Anda cari tidak dapat ditemukan.
                </p>

                <div className="mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center 
                            bg-gray-300 text-[#0b1e42] 
                            hover:bg-[#0b1e42] hover:text-gray-300 
                            rounded-xl p-2 px-5 
                            transition-transform duration-200 ease-out 
                            active:scale-95 hover:scale-[1.02] 
                            text-sm tracking-wide"
                        >
                            Kembali ke Beranda →
                        </Link>
                </div>
            </div>
        </div>
    )
}