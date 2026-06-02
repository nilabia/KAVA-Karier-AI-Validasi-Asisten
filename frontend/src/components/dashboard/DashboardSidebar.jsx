import React, { useState, useMemo } from "react";
import FileUploader from "./FileUploader.jsx";
import HistoryCard from "./HistoryCard.jsx";
import { HiDocumentText, HiClock } from "react-icons/hi";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function DashboardSidebar({
    file,
    history,
    historyLoading,
    activeId,
    showHistory,
    setShowHistory,
    onAnalyze,
    onOpenHistory,
    onDeleteHistory,
}) {
    const [numPages, setNumPages] = useState(null);

    const fileUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file);
    }, [file]); 
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

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

                    {fileUrl ? (
                        <div className="w-full h-56 overflow-y-auto rounded-xl bg-black/60 shadow-inner flex justify-center p-2 CustomScrollbar">
                            <Document
                                file={fileUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="text-xs text-gray-500 flex items-center justify-center h-full py-10">
                                        Memuat preview...
                                    </div>
                                }
                                error={
                                    <div className="text-xs text-red-500 flex flex-col items-center justify-center h-full py-10 gap-1">
                                        <span>Gagal memuat PDF.</span>
                                        <span className="text-[10px] text-gray-400">Pastikan file tidak korup</span>
                                    </div>
                                }
                            >
                                <Page 
                                    pageNumber={1} 
                                    width={220} 
                                    renderTextLayer={false} 
                                    renderAnnotationLayer={false} 
                                />
                            </Document>
                        </div>
                    ) : (
                        <div className="h-28 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center italic justify-center p-3 text-xs text-gray-400">
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
                        {historyLoading ? (
                            <p className="text-xs text-gray-400 italic">
                                Memuat riwayat....
                            </p>
                            ) : history.length === 0 ? (
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
                        * Riwayat hanya menyimpan hasil analisis CV, bukan preview PDF atau file asli.
                    </p>
                </div>
            </div>
        </aside>
    );
}