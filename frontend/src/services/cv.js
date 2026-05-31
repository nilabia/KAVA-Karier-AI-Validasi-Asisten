import { handleExpiredSession } from "../utils/session.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("accessToken");

const handleResponse = async (response) => {
    const data = await response.json();

    if (handleExpiredSession(data.message, response.status)) {
        return;
    }
    
    if (!response.ok) {
        const message = data.message || "Terjadi kesalahan.";
        const lowerMessage = message.toLowerCase();

        if (
            lowerMessage.includes("ai model") ||
            lowerMessage.includes("prediction failed") ||
            lowerMessage.includes("cv extraction failed") ||
            lowerMessage.includes("extraction failed")
        ) {
            throw new Error(
                "CV gagal dianalisis. Pastikan CV menggunakan format ATS, teks dapat diblok/copy, bukan hasil scan/foto, dan berformat PDF maksimal 5MB."
            );
        }

        throw new Error(message);
    }

    return data;
};

export const analyzeCV = async (file) => {
    const formData = new FormData();
    formData.append("cv", file);

    const response = await fetch(`${BASE_URL}/api/cv/analyze`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
    });

    return handleResponse(response);
};

export const getCVHistory = async () => {
    const response = await fetch(`${BASE_URL}/api/cv/history`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return handleResponse(response);
};

export const getCVDetail = async (id) => {
    const response = await fetch(`${BASE_URL}/api/cv/history/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return handleResponse(response);
};

export const deleteCVHistory = async (id) => {
    const response = await fetch(`${BASE_URL}/api/cv/history/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return handleResponse(response);
};