import PropTypes from "prop-types";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function PasswordMethodModal({
    isOpen,
    onClose,
    onSuccessClose,
    onChoosePassword,
    onChooseEmail,
    loading,
    error,
    successMessage,
    email,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="fixed inset-0 bg-gray-700/20 backdrop-blur-sm"
                onClick={successMessage ? onSuccessClose: onClose}
            />

            <div className="relative w-full max-w-md bg-[#152d58] border border-white/10 p-6 rounded-2xl shadow-2xl z-10 text-white animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold mb-2 text-white">
                    Ubah Password
                </h3>

                <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                    Pilih metode untuk mengubah password akun Anda.
                </p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-xs mb-4 text-center">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 px-3 py-2 rounded-xl text-sm mb-4 text-center">
                        {successMessage}
                        <p className="mt-1 text-sm text-green-100">
                            Email tujuan: {email}
                        </p>
                    </div>
                )}

                {!successMessage && (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={onChoosePassword}
                            disabled={loading}
                            className="w-full flex items-center gap-3 p-4 rounded-xl 
                            bg-[#002366]/50 border border-white/20 
                            hover:border-blue-400 hover:bg-[#002366]/70 
                            transition-all duration-300 ease-out 
                            active:scale-95 hover:scale-[1.02] 
                            disabled:opacity-50 text-left"
                        >
                            <FaLock className="text-blue-300" />
                            <div>
                                <p className="font-semibold">Via Password Lama</p>
                                <p className="text-xs text-gray-400">
                                    Gunakan password lama untuk membuat password baru.
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={onChooseEmail}
                            disabled={loading}
                            className="w-full flex items-center gap-3 p-4 rounded-xl 
                                bg-[#002366]/50 border border-white/20 
                                hover:border-blue-400 hover:bg-[#002366]/70 
                                transition-all duration-300 ease-out 
                                active:scale-95 hover:scale-[1.02] 
                                disabled:opacity-50 text-left"
                        >
                            <MdEmail className="text-blue-300" size={20} />
                            <div>
                                <p className="font-semibold">Via Email</p>
                                <p className="text-xs text-gray-400">
                                    Kirim tautan reset password ke email akun Anda.
                                </p>
                            </div>
                        </button>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-5">
                    <button
                        type="button"
                        onClick={successMessage ? onSuccessClose : onClose}
                        disabled={loading}
                        className={`px-4 py-2 rounded-xl text-base font-medium transition-colors ${
                            successMessage
                                ? "bg-green-600 hover:bg-green-500 text-white"
                                : "bg-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        {successMessage ? "OK" : "Batal"}
                    </button>
                </div>
            </div>
        </div>
    );
}

PasswordMethodModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChoosePassword: PropTypes.func.isRequired,
    onSuccessClose: PropTypes.func.isRequired,
    onChooseEmail: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    successMessage: PropTypes.string,
    email: PropTypes.string,
};