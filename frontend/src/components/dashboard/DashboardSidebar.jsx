import FileUploader from "./FileUploader.jsx";
import HistoryCard from "./HistoryCard.jsx";
import { HiDocumentText, HiClock } from "react-icons/hi";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function DashboardSidebar({
    file,
    history,
    activeId,
    showHistory,
    setShowHistory,
    onAnalyze,
    onOpenHistory,
    onDeleteHistory,
}) {
    return (
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

            <FileUploader onUpload={onAnalyze} compact />

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
                            history.map((item) => (
                                <HistoryCard
                                    key={item.id}
                                    item={item}
                                    compact
                                    isActive={item.id === activeId}
                                    onOpen={() => {
                                        onOpenHistory(item.id);
                                        setShowHistory(false);
                                    }}
                                    onDelete={(e) => onDeleteHistory(e, item.id)}
                                />
                            ))
                        )}
                    </div>

                    <p className="text-xs italic text-red-300 mt-4 leading-relaxed">
                        Riwayat hanya menyimpan hasil analisis CV, bukan preview PDF atau file asli.
                    </p>
                </div>
            </div>
        </aside>
    );
}