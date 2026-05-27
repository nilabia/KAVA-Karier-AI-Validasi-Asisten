import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUploader from "../components/FileUploader.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";
import { analyzeCV, getCVDetail, getCVHistory } from "../services/cv.js";
import { HiDocumentText, HiClock, HiTrash } from "react-icons/hi";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function DashboardPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await getCVHistory();
            setHistory(data.data.analyses || []);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchAnalysisDetail = async (analysisId) => {
        setIsLoading(true);
        setError("");

        try {
            const data = await getCVDetail(analysisId);
            setAnalysisResult(data.data.analysis);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async (selectedFile) => {
        setFile(selectedFile);
        setIsLoading(true);
        setError("");

        try {
            const data = await analyzeCV(selectedFile);
            const analysis = data.data.analysis;

            setAnalysisResult(analysis);
            await fetchHistory();

            navigate(`/dashboard/history/${analysis.id}`);
            setShowHistory(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteHistory = (e, itemId) => {
        e.stopPropagation();

        const confirmDelete = window.confirm(
            "Apakah kamu yakin ingin menghapus riwayat analisis ini?"
        );

        if (!confirmDelete) return;

        setHistory((prev) => prev.filter((item) => item.id !== itemId));

        if (id === itemId) {
            navigate("/dashboard");
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (id) {
            fetchAnalysisDetail(id);
        } else {
            setAnalysisResult(null);
            setFile(null);
        }
    }, [id]);

    return (
        <div className="min-h-screen px-4 mt-5 md:px-8 py-8 text-white">
            <div className="max-w-7xl mx-auto">
                {!id ? (
                    <div className="space-y-12 animate-fade-in">
                        <section className="flex flex-col items-center justify-center min-h-[45vh] text-center max-w-2xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 flex items-center gap-3">
                                Unggah CV untuk Analisis
                            </h1>

                            <p className="text-[#0b1e42] bg-amber-300 px-5 py-2 rounded-xl font-bold text-sm md:text-base shadow-md mb-6 mt-3">
                                Pastikan CV-mu menggunakan format ATS untuk hasil optimal!
                            </p>

                            <FileUploader onUpload={handleAnalyze} />

                            {isLoading && (
                                <div className="flex items-center gap-3 mt-6">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-400 border-t-transparent" />
                                    <p className="text-white/80 text-xs font-medium animate-pulse">
                                        Mengekstrak berkas CV...
                                    </p>
                                </div>
                            )}

                            {error && (
                                <p className="text-rose-300 mt-4 text-xs font-semibold">
                                    {error}
                                </p>
                            )}
                        </section>

                        <section className="pt-8 border-t border-white/30">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white/90">
                                <HiClock className="text-amber-300" />
                                Riwayat Analisis Kamu
                            </h2>

                            {history.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">
                                    Belum ada riwayat analisis. Silakan unggah CV pertama kamu di atas!
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {history.map((item) => {
                                        const progressValue =
                                            item.skill_gap?.progress_bar_value ??
                                            (item.skill_gap?.coverage_pct || 0) / 100;

                                        const progressPercent = Math.round(progressValue * 100);

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => navigate(`/dashboard/history/${item.id}`)}
                                                className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between h-36 shadow-lg shadow-black/10"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-white truncate pr-8">
                                                        {item.cv_filename || "Nama file tidak tersimpan"}
                                                    </p>

                                                    <p className="text-xs text-amber-300 font-medium mt-1">
                                                        🎯 {item.top_roles?.[0]?.role || "General Role"}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center text-[11px] text-gray-400 border-t border-white/30 pt-3">
                                                    <span>
                                                        {new Date(item.created_at).toLocaleString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}{" "}
                                                        WIB
                                                    </span>

                                                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                                        Skor: {progressPercent}%
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={(e) => handleDeleteHistory(e, item.id)}
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                    title="Hapus Riwayat"
                                                >
                                                    <HiTrash className="text-base" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start animate-fade-in min-h-0">
                        <aside
                            className="
                                order-2 lg:order-1
                                bg-white/5 border border-white/10 rounded-4xl
                                p-5 backdrop-blur-md space-y-5
                                lg:sticky lg:top-6
                                lg:max-h-[calc(100vh-3rem)]
                                lg:overflow-y-auto
                                min-h-0
                                CustomScrollbar
                            "
                        >
                            <div>
                                <h2 className="text-sm font-bold flex items-center gap-2 text-white/70 uppercase tracking-wider">
                                    <HiDocumentText className="text-sm text-amber-300" />
                                    Preview Dokumen
                                </h2>

                                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 mt-4 text-center">
                                    <p className="text-xs font-medium text-gray-300 break-all line-clamp-1 mb-2">
                                        {file?.name || "Arsip File Terpilih"}
                                    </p>

                                    {file ? (
                                        <iframe
                                            src={URL.createObjectURL(file)}
                                            title="Preview CV"
                                            className="w-full h-56 rounded-xl bg-white shadow-inner"
                                        />
                                    ) : (
                                        <div className="h-28 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center p-3 text-xs text-gray-400">
                                            <span>
                                                Pratinjau fisik PDF hanya aktif setelah upload baru.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <FileUploader onUpload={handleAnalyze} compact />

                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="lg:hidden w-full bg-white/10 border border-white/10 text-white px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                {showHistory ? (
                                    <>
                                        <IoClose className="text-xl" />
                                        <span>Tutup Riwayat</span>
                                    </>
                                ) : (
                                    <>
                                        <FaBars className="text-lg" />
                                        <span>Lihat Riwayat</span>
                                    </>
                                )}
                            </button>

                            <div className={`${showHistory ? "block" : "hidden"} lg:block`}>
                                <div className="pt-2 border-t border-white/10">
                                    <h3 className="text-sm font-bold tracking-wider uppercase text-gray-400 flex items-center gap-2 mb-3">
                                        <HiClock />
                                        Riwayat Lainnya
                                    </h3>

                                    <div className="space-y-2 pr-1">
                                        {history.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic">
                                                Belum ada riwayat lain.
                                            </p>
                                        ) : (
                                            history.map((item) => {
                                                const isActive = item.id === id;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            navigate(`/dashboard/history/${item.id}`);
                                                            setShowHistory(false);
                                                        }}
                                                        className={`group relative w-full text-left p-3 rounded-xl transition border text-xs cursor-pointer flex justify-between items-center ${
                                                            isActive
                                                                ? "bg-white/10 text-white font-bold border-white/20"
                                                                : "bg-white/5 text-gray-300 border-transparent hover:bg-white/10"
                                                        }`}
                                                    >
                                                        <div className="truncate pr-6">
                                                            <p className="truncate font-semibold text-xs">
                                                                {item.cv_filename || "Nama file tidak tersimpan"}
                                                            </p>

                                                            <p className="text-[9px] opacity-50 mt-0.5">
                                                                {new Date(item.created_at).toLocaleDateString("id-ID")}
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={(e) => handleDeleteHistory(e, item.id)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-400 p-1 rounded transition-all"
                                                        >
                                                            <HiTrash />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <p className="text-xs italic text-red-300 mt-4 leading-relaxed">
                                        Riwayat hanya menyimpan hasil analisis CV, bukan preview PDF atau file asli.
                                    </p>
                                </div>
                            </div>
                        </aside>

                        <main className="order-1 lg:order-2 bg-gray-200 rounded-4xl p-6 md:p-10 text-gray-800 shadow-2xl min-h-[70vh]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center min-h-[30vh] gap-2">
                                    <div className="animate-spin rounded-full h-7 w-7 border-2 border-[#0b1e42] border-t-transparent" />

                                    <p className="text-[#0b1e42] font-semibold text-xs animate-pulse">
                                        Mengambil data analisis...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs">
                                    {error}
                                </div>
                            ) : (
                                <AnalysisResult analysis={analysisResult} />
                            )}
                        </main>
                    </section>
                )}
            </div>
        </div>
    );
}