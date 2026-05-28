import { HiTrash } from "react-icons/hi";

export default function HistoryCard({ item, onOpen, onDelete, compact = false, isActive = false }) {
    const progressValue =
        item.skill_gap?.progress_bar_value ??
        (item.skill_gap?.coverage_pct || 0) / 100;

    const progressPercent = Math.round(progressValue * 100);

    if (compact) {
        return (
            <div
                onClick={onOpen}
                className={`group relative w-full text-left p-3 rounded-xl transition border text-xs cursor-pointer flex justify-between items-center ${
                    isActive
                        ? "bg-white/10 text-white font-bold border-white/20"
                        : "bg-white/5 text-gray-300 border-transparent hover:bg-white/10"
                }`}
            >
                <div className="truncate pr-6">
                    <p className="truncate font-semibold text-sm">
                        {item.cv_filename || "Nama file tidak tersimpan"}
                    </p>

                    <p className="text-[11px] opacity-50 mt-0.5">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </p>
                </div>

                <button
                    onClick={onDelete}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-400 p-1 rounded transition-all"
                >
                    <HiTrash size={14} />
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={onOpen}
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
                onClick={onDelete}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Hapus Riwayat"
            >
                <HiTrash className="text-base" />
            </button>
        </div>
    );
}