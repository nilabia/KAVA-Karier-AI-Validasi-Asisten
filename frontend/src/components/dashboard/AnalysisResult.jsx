import ReactMarkdown from "react-markdown";
import { HiCheckCircle, HiExclamationCircle, HiAcademicCap, HiExternalLink } from "react-icons/hi";
import PropTypes from "prop-types";

export default function AnalysisResult({ analysis }) {
    const topRoles = analysis?.top_roles || [];
    const skillGap = analysis?.skill_gap || {};

    const matchedSkills = skillGap.matched_skills || [];
    const missingSkills = skillGap.missing_skills || [];
    const progressValue = skillGap.progress_bar_value ?? (skillGap.coverage_pct || 0) / 100;
    const progressPercent = Math.round(progressValue * 100);

    return (
        <div className="space-y-10 animate-fade-in text-gray-800">
            <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#0b1e42] tracking-tight mb-5 flex items-center gap-2">
                    <span className="p-1.5 bg-blue-50 text-[#0b1e42] rounded-lg">🎯</span> 
                    3 Top Job yang Cocok Buat Kamu
                </h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {topRoles.map((item, index) => (
                        <div
                            key={item.rank || index}
                            className="relative overflow-hidden border p-4 rounded-2xl 
                                transition-all duration-300 hover:shadow-md
                                bg-gradient-to-br from-[#0b1e42] to-[#1a3a6f] 
                                text-white border-transparent shadow-lg shadow-blue-900/10 
                                scale-[1.01] flex flex-col min-h-35"
                        >
                            <span className="absolute -right-2 -bottom-4 text-6xl font-black opacity-10 text-white">
                                #{index + 1}
                            </span>
                            
                            <p className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-2">
                                Rekomendasi {index + 1}
                            </p>

                            <h3 className="font-bold text-base md:text-lg leading-tight mb-2 pr-6">
                                {item.role}
                            </h3>

                            <div className="flex items-center gap-1.5 mt-auto">
                                <div className={`h-2 w-2 rounded-full ${index === 0 ? "bg-emerald-400" : "bg-emerald-500"}`}></div>
                                <span className="text-xs font-semibold text-gray-200">
                                    Match: {item.confidence?.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#0b1e42]">Kecocokan Skill</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Persentase kesiapan berdasarkan kualifikasi industri.</p>
                    </div>
                    <span className="text-2xl font-black text-[#0b1e42] bg-amber-300 px-3 py-1 rounded-xl shadow-sm">
                        {progressPercent}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
                    <div
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-emerald-600/30 bg-emerald-50/50 rounded-2xl p-5">
                    <h3 className="font-bold text-[#0b1e42] text-base md:text-lg flex items-center gap-2 mb-4">
                        <HiCheckCircle className="text-emerald-600 text-xl" /> Skill yang Sudah Cocok
                    </h3>
                    {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((skill) => (
                                <span key={skill} className="bg-emerald-100/70 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm transition hover:scale-105">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">Belum ada skill yang cocok.</p>
                    )}
                </div>

                <div className="border border-rose-400/40 bg-rose-50/40 rounded-2xl p-5">
                    <h3 className="font-bold text-[#0b1e42] text-base md:text-lg flex items-center gap-2 mb-4">
                        <HiExclamationCircle className="text-rose-500 text-xl" /> Skill yang Perlu Ditingkatkan
                    </h3>
                    {missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill) => (
                                <span key={skill} className="bg-rose-100/70 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm transition hover:scale-105">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">-</p>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0b1e42] mb-3 flex items-center gap-2">
                    <span>💡</span> Career Insights & Advice
                </h2>
                <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50 shadow-sm text-gray-700 leading-relaxed text-sm space-y-4">
                    <ReactMarkdown 
                        components={{
                            p: ({node, ...props}) => {
                                if (!props.children || props.children.toString().trim() === "") return null;
                                return <p className="mb-3 text-justify last:mb-0 leading-relaxed" {...props} />;
                            },

                            li: ({node, ...props}) => {
                                const content = props.children;
                                
                                if (!content || (Array.isArray(content) && content.length === 0) || content.toString().trim() === "") {
                                    return null; 
                                }
                                
                                return (
                                    <li className="list-disc list-outside mb-3 text-gray-600 ml-4 pl-1 leading-relaxed">
                                        {props.children}
                                    </li>
                                );
                            },

                            ul: ({node, ...props}) => (
                                <ul className="my-3 pl-2 space-y-1" {...props} />
                            ),

                            strong: ({node, ...props}) => (
                                <strong className="font-bold text-[#0b1e42]" {...props} />
                            ),

                            h3: ({node, ...props}) => (
                                <h3 className="font-bold text-[#0b1e42] text-base mt-4 mb-2 block" {...props} />
                            )
                        }}
                    >
                        {analysis?.career_advice || "Belum ada deskripsi."}
                    </ReactMarkdown>
                </div>
            </div>

            <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0b1e42] mb-4 flex items-center gap-2">
                    <HiAcademicCap className="text-xl text-blue-600" /> Rekomendasi Jalur Belajar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {missingSkills.length > 0 ? (
                        missingSkills.map((skill) => (
                            <a
                                key={skill}
                                href={`https://www.coursera.org/search?query=${skill}`}
                                target="_blank"
                                rel="noreferrer"
                                className="group border border-gray-100 rounded-2xl p-4 bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-bold text-[#0b1e42] group-hover:text-blue-600 transition-colors text-base">
                                        Kuasai {skill}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">Cari modul kelas di Coursera</p>
                                </div>
                                <HiExternalLink className="text-gray-300 group-hover:text-blue-500 transition-colors text-lg" />
                            </a>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm italic col-span-2">Tidak ada gap skill masif yang ditemukan.</p>
                    )}
                </div>
            </div>
        </div>
    );
}