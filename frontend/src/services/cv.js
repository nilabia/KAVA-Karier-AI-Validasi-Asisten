const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("accessToken");

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
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