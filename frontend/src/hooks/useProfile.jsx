import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, forgotPassword } from "../services/auth.js";

export default function useProfile() {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const [user, setUser] = useState({
        name: "",
        email: "",
        loginMethod: "email"
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [profileError, setProfileError] = useState("");
    const [editName, setEditName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [activeModal, setActiveModal] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    useEffect(() => {
        const fetchUserProfile = async() => {
            setPageLoading(true);
            const result = await getProfile();

            if(result.status === "success") {
                setUser({
                    name: result.data.user.name,
                    email: result.data.user.email,
                    loginMethod: result.data.user.hasPassword === false ? "google" : "email"
                });
                setTempName(result.data.user.name);
            } else {
                setProfileError(result.message || "Gagal memuat profil.");
            }
            setPageLoading(false);
        };
        fetchUserProfile();
    }, []);

    const handleSaveName = async() => {
        if (tempName.trim().length < 2) {
            return alert("Nama tidak boleh kosong dan minimal 2 karakter!");
        }
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${BASE_URL}/users/name`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: tempName })
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                setUser(prev => ({
                    ...prev,
                    name: tempName
                }));
                setEditName(false);
                alert("Nama berhasil diperbarui!");
            } else {
                alert(data.message || "Gagal memperbarui nama.");
            }
        } catch (error) {
            alert("Gagal terhubung ke server saat memperbarui nama. Silahkan coba lagi.");
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return setModalError("Password baru dan konfirmasi password baru harus sama!");
        }

        setModalLoading(true);
        setModalError("");

        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${BASE_URL}/users/password`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                alert("Password berhasil diperbarui! Silahkan login kembali.");
                localStorage.clear();
                navigate("/auth/login", { replace: true });
            } else {
                // INI PESAN DARI BACKEND UNTUK AKUN GOOGLE YANG BELUM PUNYA PASSWORD
                if (data.message === "Use PUT /users/set-password to set your password first") {
                    setModalError(
                        "Akun ini belum memiliki password. Silakan gunakan metode Via Email untuk membuat password terlebih dahulu."
                    );
                } else {
                    setModalError(
                        data.message || "Gagal mengubah password. Silakan coba lagi nanti."
                    );
                }
            }
        } catch (error) {
            setModalError("Gagal terhubung ke server.");
        } finally {
            setModalLoading(false);
        }
    };
    const handleDeleteAccount = async () => {
        setModalLoading(true);
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${BASE_URL}/users/me`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok && data.status === "success") {
                alert("Akun KAVA Anda berhasil dihapus secara permanen.");
                localStorage.clear();
                navigate("/auth/login", { replace: true });
            } else {
                setModalError(data.message || "Gagal menghapus akun. Silahkan coba lagi nanti.");
            }
        } catch (error) {
            setModalError("Gagal terhubung ke server.");
        } finally{
            setModalLoading(false);
        }
    };

    const handleForgotPasswordByEmail = async () => {
        if (!user.email) {
            return setModalError("Email pengguna tidak ditemukan.");
        }

        setModalLoading(true);
        setModalError("");
        setModalSuccess("");

        const result = await forgotPassword(user.email);

        if (result.status === "success") {
            setModalSuccess(
                "Link reset password telah dikirim. Silakan cek inbox atau spam."
            );
        } else {
            setModalError(
                result.message || "Gagal mengirim link reset password. Silahkan coba lagi nanti."
            );
        }

        setModalLoading(false);
    };

    const handleForgotPasswordSuccess = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/auth/login", { replace: true });
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setModalSuccess("");
    };
    
    return {
        user,
        pageLoading,
        profileError,
        editName,
        setEditName,
        tempName,
        setTempName,
        activeModal,
        setActiveModal,
        modalLoading,
        modalError,
        oldPassword,
        setOldPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        handleSaveName,
        handleUpdatePassword,
        handleDeleteAccount,
        closeModal,
        modalSuccess,
        handleForgotPasswordByEmail,
        handleForgotPasswordSuccess
    };
}