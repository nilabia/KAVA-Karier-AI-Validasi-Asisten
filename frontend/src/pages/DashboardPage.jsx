import { useState } from "react";
import FileUploader from "../components/FileUploader.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";

export default function DashboardPage() {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    
    const handleFileSelected = (selectedFile) => {
        setFile(selectedFile);
        console.log("File siap dianalisis:", selectedFile);
    };

    return(
        <div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 mt-15">
            {!file && (
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Unggah CV untuk Analisis
                    </h1>
                    <p className="text-[#0b1e42] bg-amber-300">
                        Pastikan CV-mu menggunakan format ATS
                    </p>

                    <div className="flex flex-col md:flex-row w-full max-w-6xl gap-10 items-center justify-center transition-all duration-1000">
                        <div className={`${file ? "w-full md-w-1/3" : "w-full max-w-xl flex justify-center"}`}>
                            <FileUploader onUpload={handleFileSelected} file={file} />
                        </div>

                        {file && (
                            <div className="w-full md:2-2/3">
                                <AnalysisResult file={file} onReset={() => setFile(null)} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}