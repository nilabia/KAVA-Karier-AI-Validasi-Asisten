import { FaLock } from "react-icons/fa";
import PropTypes from "prop-types";
import { useState } from "react";

export default function PasswordModal({ isOpen, onClose, onSubmit, error, loading, formStates }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="fixed inset-0 bg-gray-700/20 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-[#152d58] border-white/10 p-6 rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-300">
                    <FaLock className="mr-2" size={18}/>
                    Ubah Password
                </h3>
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-xs mb-4 text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">
                            Password Lama
                        </label>
                        <input
                            className="w-full p-2.5 bg-[#002366]/50 border border-white/30 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                            type="password"
                            required
                            minLength={8}
                            value={formStates.oldPassword}
                            onChange={(e) => formStates.setOldPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">
                            Password Baru
                        </label>
                        <input
                            className="w-full p-2.5 bg-[#002366]/50 border border-white/30 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                            type="password"
                            required
                            minLength={8}
                            value={formStates.newPassword}
                            onChange={(e) => formStates.setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            className="w-full p-2.5 bg-[#002366]/50 border border-white/30 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                            type="password"
                            required
                            minLength={8}
                            value={formStates.confirmPassword}
                            onChange={(e) => formStates.setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-sm font-medium"
                        >
                            Batal
                        </button>
                        <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium text-white transition-colors"
                        >
                            {loading ? "Memproses..." : "Simpan & Login Ulang"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

PasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool,
    formStates: PropTypes.shape({
        oldPassword: PropTypes.string.isRequired,
        newPassword: PropTypes.string.isRequired,
        confirmPassword: PropTypes.string.isRequired,
        setOldPassword: PropTypes.func.isRequired,
        setNewPassword: PropTypes.func.isRequired,
        setConfirmPassword: PropTypes.func.isRequired,
    }).isRequired
};