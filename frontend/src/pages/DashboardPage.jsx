import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnalysisResult from "../components/dashboard/AnalysisResult.jsx";
import DashboardHome from "../components/dashboard/DashboardHome.jsx";
import DashboardSidebar from "../components/dashboard/DashboardSidebar.jsx";
import { analyzeCV, getCVDetail, getCVHistory, deleteCVHistory } from "../services/cv.js";
import { FaClipboardCheck } from "react-icons/fa";

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
            setAnalysisResult(null);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenHistory = (historyId) => {
        navigate(`/dashboard/history/${historyId}`);
    };

    const handleDeleteHistory = async (e, itemId) => {
        e.stopPropagation();

        const confirmDelete = window.confirm(
            "Apakah kamu yakin ingin menghapus riwayat analisis ini?"
        );

        if (!confirmDelete) return;

        try {
            await deleteCVHistory(itemId);

            setHistory((prev) => prev.filter((item) => item.id !== itemId));

            if (id === itemId) {
                setAnalysisResult(null);
                setError("Riwayat analisis ini sudah dihapus.");
            }
        } catch (error) {
            alert(error.message || "Gagal menghapus riwayat.");
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
                    <DashboardHome
                        history={history}
                        isLoading={isLoading}
                        error={error}
                        onAnalyze={handleAnalyze}
                        onOpenHistory={handleOpenHistory}
                        onDeleteHistory={handleDeleteHistory}
                    />
                ) : (
                    <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start animate-fade-in min-h-0">
                        <DashboardSidebar
                            file={file}
                            history={history}
                            activeId={id}
                            showHistory={showHistory}
                            setShowHistory={setShowHistory}
                            onAnalyze={handleAnalyze}
                            onOpenHistory={handleOpenHistory}
                            onDeleteHistory={handleDeleteHistory}
                        />

                        <main className="order-1 lg:order-2 bg-gray-200/90 rounded-4xl p-6 md:p-10 text-gray-800 shadow-2xl min-h-[70vh]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center min-h-[30vh] gap-2">
                                    <div className="animate-spin rounded-full h-7 w-7 border-2 border-[#0b1e42] border-t-transparent" />

                                    <p className="text-[#0b1e42] font-semibold text-xs animate-pulse">
                                        Mengambil data analisis...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                                    <div className="bg-rose-50 border border-rose-500 p-10 rounded-3xl shadow-sm max-w-md">
                                        <h3 className="text-lg font-bold text-rose-600 flex items-center justify-center gap-2 mb-2">
                                            Riwayat Berhasil Dihapus
                                            <FaClipboardCheck size={22}/>
                                        </h3>

                                        <p className="text-sm text-rose-500 leading-relaxed">
                                            Riwayat analisis ini sudah tidak tersedia lagi.
                                        </p>
                                    </div>
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