import { FaCommentDots } from "react-icons/fa6";

export default function FeedbackCard() {
    return (
        <div className="mt-10 border border-yellow-400 rounded-3xl bg-amber-100/95 p-6 md:p-8 shadow-sm">
            <div className="text-center">
                <h2 className="flex items-center justify-center gap-3 text-lg md:text-xl font-black text-[#0b1e42]">
                    <FaCommentDots className="text-[#0b1e42] text-xl md:text-2xl" size={22} />
                    <span>Bantu Tingkatkan KAVA</span>
                </h2>

                <p className="text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed text-xs md:text-sm">
                    Apakah hasil analisis AI KAVA membantu?
                    Kami sangat menghargai kritik, saran, maupun laporan bug
                    untuk meningkatkan kualitas analisis CV dan pengalaman pengguna.
                </p>

                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdjXa14UT5Vzm6mwHbiQgHg9-dt_SiuB1jNkKV7kZ_J8UeL0Q/viewform?usp=publish-editor"
                    target="_blank"
                    rel="noreferrer"
                    className="
                        inline-flex items-center justify-center
                        mt-6
                        bg-[#0b1e42]
                        hover:bg-[#123066]
                        text-white
                        font-bold
                        px-6 py-3
                        rounded-2xl
                        transition-all duration-300
                        hover:scale-[1.02]
                        shadow-lg
                    "
                >
                    Kirim Feedback
                </a>
            </div>
        </div>
    );
}