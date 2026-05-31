import FileUploader from "./FileUploader.jsx";
import HistoryCard from "./HistoryCard.jsx";
import { HiClock } from "react-icons/hi";

export default function DashboardHome({
    history,
    isLoading,
    error,
    onAnalyze,
    onOpenHistory,
    onDeleteHistory,
}) {
    return (
        <div className="space-y-12 animate-fade-in">
            <section className="flex flex-col items-center justify-center min-h-[45vh] text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 flex items-center gap-3">
                    Unggah CV untuk Analisis
                </h1>

                <p className="text-[#0b1e42] bg-amber-200 px-5 py-2 rounded-xl font-medium text-sm md:text-base shadow-md mb-6 mt-3">
                    Pastikan CV-mu menggunakan format ATS untuk hasil optimal!
                </p>

                <FileUploader onUpload={onAnalyze} />

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
                        {history.map((item) => (
                            <HistoryCard
                                key={item.id}
                                item={item}
                                onOpen={() => onOpenHistory(item.id)}
                                onDelete={(e) => onDeleteHistory(e, item.id)}
                            />
                        ))}
                    </div>
                )}
                <div className="mt-10 border-t border-white/30"/>
            </section>
        </div>
    );
}