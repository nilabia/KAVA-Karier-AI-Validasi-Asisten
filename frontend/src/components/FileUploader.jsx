import React, { useState } from "react";
import { HiUpload } from "react-icons/hi";

export default function FileUploader({ onUpload, file }){
    const [isDragActive, setIsDragActive] = useState(false);

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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className={`relative w-full max-w-xl p-10 border-2 border-dashed rounded-[30px] transition-all duration-300 flex flex-col items-center justify-center mt-10
                ${isDragActive 
                    ? "border-yellow-300 bg-white/10 scale-50"
                    : "border-white/30 bg-white/5 hover:border-white/50"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleChange}
                accept=".pdf"
            />

            <div className="flex flex-col items-center gap-4">
                <div className="p-5 bg-white/10 rounded-full shadow-lg">
                    <HiUpload className="text-5xl text-white" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white">Drop or Click</h2>
                    <p className="text-gray-300 mt-1">Upload CV mu di sini</p>
                </div>
            </div>
        </div>
    );
}