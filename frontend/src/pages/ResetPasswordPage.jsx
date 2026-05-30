import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { resetPassword } from "../services/auth";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        const savedToken = sessionStorage.getItem("resetToken");

        if (tokenFromUrl) {
            sessionStorage.setItem("resetToken", tokenFromUrl);
            setToken(tokenFromUrl);

            navigate("/reset-password", { replace: true });
        } else if (savedToken) {
            setToken(savedToken);
        } else {
            setError("Sesi berakhir. Silahkan melakukan reset password ulang.");
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!token) {
            return setError("Token tidak ditemukan. Link reset password tidak valid.");
        }

        if (newPassword !== confirmPassword) {
            return setError("Password dan konfirmasi password harus sama.");
        }

        try {
            setLoading(true);

            const data = await resetPassword({
                token,
                newPassword,
            });

            if (data.status === "success") {
                sessionStorage.removeItem("resetToken");
                setError("");
                setSuccessMessage("");
                setShowSuccessModal(true);
            } else {
                if (
                    data.message?.toLowerCase().includes("invalid") ||
                    data.message?.toLowerCase().includes("expired")
                ) {
                    sessionStorage.removeItem("resetToken");
                    setError("Link reset password sudah tidak berlaku. Silakan ajukan reset password kembali.");
                } else {
                    setError(data.message || "Gagal mengubah password.")
                }
            }
        } catch (err) {
            setError("Gagal terhubung ke server. Silahkan coba beberapa saat lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 text-white">
            <div className="w-full max-w-md bg-gray-600/10 backdrop-blur-md rounded-[20px] shadow-2xl shadow-[#0b1e42] border border-white/5 p-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <FaLock size={20} />
                    Lupa Password
                </h2>

                <p className="text-sm text-gray-300 mb-5">
                    Masukkan password baru untuk akun KAVA Anda.
                </p>

                {error && !showSuccessModal && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 px-3 py-2 rounded-lg text-sm mb-4 text-center">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Password Baru
                        </label>
                        <input
                            type="password"
                            minLength={8}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2.5 bg-[#002366]/50 border border-white/30 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                            disabled={loading || !!successMessage}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            minLength={8}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2.5 bg-[#002366]/50 border border-white/30 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                            disabled={loading || !!successMessage}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!successMessage}
                        className="w-full bg-white text-[#0b1e42] rounded-[20px] p-2 mt-4 font-bold hover:bg-[#A8F3FF] transition disabled:opacity-60"
                    >
                        {loading ? "Memproses..." : "Ubah Password"}
                    </button>
                </form>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-bg-gray-700/20 border-black rounded-2xl backdrop-blur-xs" />

                    <div className="relative bg-[#152d58] rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
                        <h3 className="text-xl font-bold mb-3">
                            Password Berhasil Diubah
                        </h3>

                        <p className="text-sm text-gray-300 mb-5">
                            Silakan login kembali menggunakan password baru Anda.
                        </p>

                        <button
                            onClick={() => {
                                localStorage.removeItem("accessToken");
                                localStorage.removeItem("refreshToken");

                                navigate("/auth/login", {
                                    replace: true,
                                });
                            }}
                            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl font-medium"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}