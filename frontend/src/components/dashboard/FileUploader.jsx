import { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";

export default function FileUploader({ onUpload, compact = false }) {
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef(null);

    const validateFile = (selectedFile) => {
        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            alert("File harus berformat PDF.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert("Ukuran file maksimal 5MB.");
            return;
        }

        onUpload(selectedFile);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        validateFile(e.dataTransfer.files?.[0]);
    };

    const handleChange = (e) => {
        validateFile(e.target.files?.[0]);
        e.target.value = "";
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
                relative w-full border-2 border-dashed rounded-3xl cursor-pointer
                transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-sm
                ${compact ? "p-6" : "max-w-xl p-12 mt-6 mb-3 shadow-xl shadow-black/5"}
                ${isDragActive
                    ? "border-amber-400 bg-white/10 scale-[1.02] shadow-amber-500/10 shadow-lg"
                    : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:scale-[1.01]"
                }
            `}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf"
            />

            <div className="flex flex-col items-center gap-2 text-center select-none">
                <div className={`
                    ${compact ? "p-3" : "p-5"} 
                    transition-transform duration-300 group-hover:scale-110
                `}>
                    <FiUpload size={60} className={`${compact ? "text-2xl" : "text-4xl"} text-white`} />
                </div>

                <div>
                    <h2 className={`${compact ? "text-base" : "text-2xl"} font-bold text-white tracking-wide`}>
                        {isDragActive ? "Lepaskan File di Sini" : "Drop or Click to Upload"}
                    </h2>

                    <p className="text-gray-300/80 mt-1 text-sm font-medium">
                        Unggah CV PDF maks. 5MB
                    </p>
                </div>
            </div>
        </div>
    );
}