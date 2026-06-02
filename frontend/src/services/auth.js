import { handleExpiredSession } from '../utils/session.js';
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000" || import.meta.env.VITE_API_DEV_URL;

const handleResponse = async (responseFn, option = {}) => {
    try {
        const response = await responseFn();
        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
            return {
                status: "error",
                message: "Server sedang bermasalah (bukan respon JSON)."
            };
        }

        const data = await response.json();

        if (
            !option.skipExpiredSessionCheck &&
            handleExpiredSession(data.message, response.status)
        ) {
            return {
                status: "error",
                message: "Sesi login berakhir. Silakan login kembali."
            };
        }

        if (!response.ok) {
            return {
                status: data.status || "failed",
                message: data.message || "Terjadi kesalahan."
            };
        }

        return data;
    } catch (error) {
        return {
            status: "error",
            message: "Gagal terhubung ke server. Silahkan coba lagi nanti."
        };
    }
};

export const registerUser = async (userData) =>
    handleResponse(() => fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData),
    }), { skipExpiredSessionCheck: true });

export const verifyEmail = async ({ email, code }) =>
    handleResponse(() => fetch(`${BASE_URL}/users/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code }),
    }), { skipExpiredSessionCheck: true });

export const loginUser = async (credentials) =>
    handleResponse(() => fetch(`${BASE_URL}/authentications/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials),
    }), { skipExpiredSessionCheck: true });

export const loginWithGoogle = async (idToken) =>
    handleResponse(() => fetch(`${BASE_URL}/authentications/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken }),
    }), { skipExpiredSessionCheck: true });

export const refreshToken = async() => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    return handleResponse(() => fetch(`${BASE_URL}/authentications/refresh`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
    }));
};

export const logoutUser = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    return handleResponse(() => fetch(`${BASE_URL}/authentications/logout`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({refreshToken: storedRefreshToken}),
    }));
};

export const getProfile = async () => {
    const token = localStorage.getItem("accessToken");
    return handleResponse(() => fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    }));
};

export const forgotPassword = async (email) =>
    handleResponse(() => fetch(`${BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email }),
    }), { skipExpiredSessionCheck: true });

export const resetPassword = async ({ token, newPassword }) =>
    handleResponse(() => fetch(`${BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword })
    }), { skipExpiredSessionCheck: true });