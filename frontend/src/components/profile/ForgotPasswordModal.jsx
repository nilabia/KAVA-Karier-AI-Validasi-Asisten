import { useState } from "react";
import PropTypes from "prop-types";
import { MdEmail } from "react-icons/md";
import { forgotPassword } from "../../services/auth";
import { createPortal } from "react-dom";

export default function ForgotPasswordModal({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if(!isOpen) return null;

    const handleLocalClose = () => {
        setEmail("");
        setError("");
        setSuccessMessage("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (successMessage) {
            handleLocalClose();
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const data = await forgotPassword(email);

            if (data.status === "success") {
                setSuccessMessage("Reset password berhasil! Silahkan periksa kotak masuk atau folder spam email Anda.");
            } else {
                setError(data.message || "Gagal mengirimkan email reset password");
            }
        } catch (err) {
            setError(err.message || "Gagal terhubung ke server. Silahkan coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div
                className="fixed inset-0 rounded-2xl bg-gray-700/20 backdrop-blur-xs"
                onClick={handleLocalClose}
            />

            <div className="relative w-full max-w-md bg-[#152d58] border border-white/10 p-6 rounded-2xl shadow-2xl z-10 text-white animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold mb-2 flex items-center text-white">
                    <MdEmail className="mr-2" size={20} />
                    Lupa Password
                </h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Masukkan email Anda yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang password Anda.
                </p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-xs mb-4 text-center">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 px-3 py-2 rounded-xl text-xs mb-4 text-center">
                        {successMessage}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Alamat Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full p-2.5 bg-[#002366]/50 border border-white/30 rounded-xl text-white outline-none focus:border-blue-500 text-sm disabled:opacity-50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || !!successMessage}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        {!successMessage && (
                            <button
                                type="button"
                                onClick={handleLocalClose}
                                disabled={loading}
                                className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-sm font-medium"
                            >
                                Batal
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${successMessage ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"}`}
                        >
                            {loading ? "Mengirim..." : successMessage ? "Tutup" : "Kirim Link Reset"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

ForgotPasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};