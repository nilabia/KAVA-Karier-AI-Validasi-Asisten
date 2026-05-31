import useProfile from "../hooks/useProfile.jsx";
import PasswordModal from "../components/profile/PasswordModal.jsx";
import PasswordMethodModal from "../components/profile/PasswordMethodModal.jsx";
import DeleteAccountModal from "../components/profile/DeleteAccountModal.jsx";
import { FaCheck, FaEnvelope, FaLock, FaPen, FaTimes, FaTrashAlt, FaUser } from "react-icons/fa";

export default function ProfilePage() {
    const {
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
        handleForgotPasswordByEmail,
        handleForgotPasswordSuccess,
        modalSuccess,
        closeModal
    } = useProfile();

    const rowContainerClass = "flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/20 pb-6";
    const iconWrapperClass = "p-3 bg-[#0b1e42] rounded-lg text-blue-400";
    const labelClass = "text-xs text-gray-400 tracking-wider";
    const buttonActionClass = "text-xs text-blue-200 hover:text-blue-300 flex items-center space-x-1 bg-[#0b1e42] py-2 px-4 rounded-lg border border-white/5 transition-all";
    const infoGroupClass = "flex items-center space-x-4 flex-1";

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] text-white">
                <p className="text-lg tracking-widest animate-pulse">
                    Memuat Profile KAVA...
                </p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start pt-10 px-4 min-h-[calc(100vh-64px)] bg-transparent text-white">
            <div className="w-full max-w-2xl space-y-6 mb-10">
                {profileError &&
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-xl text-center">
                        {profileError}
                    </div>
                }

                <section className="bg-gray-500/10 border border-white/5 p-6 backdrop-blur-md bg-gray/30 rounded-[20px] shadow-2xl shadow-[#0b1e42]">
                    <h2 className="text-2xl font-bold uppercase mb-6 text-white text-center border-b border-white/40 pb-5">
                    Informasi Akun
                    </h2>

                    <div className="space-y-6">
                        <div className={rowContainerClass}>
                            <div className={infoGroupClass}>
                                <div className={iconWrapperClass}>
                                    <FaUser size={17}/>
                                </div>

                                <div className="flex-1">
                                    <label className={labelClass} htmlFor={editName ? "nameInput" : undefined}>
                                        Nama Lengkap
                                    </label>
                                    {editName ? (
                                        <input
                                            id="nameInput"
                                            type="text"
                                            className="mt-1 w-full max-w-xs p-1.5 bg-[#0b1e42] border border-blue-500 rounded text-white outline-none text-sm"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        <p className="text-base font-medium mt-1">
                                            {user.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                                
                            <div className="mt-2 sm:mt-0 pl-14 sm:pl-0 flex items-center sm:pb-0.5">
                                {editName ? (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSaveName}
                                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs flex items-center space-x-1"
                                        >
                                            <FaCheck />
                                            <span>Simpan</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditName(false);
                                                setTempName(user.name);
                                            }}
                                            className="p-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-xs flex items-center space-x-1"
                                        >
                                            <FaTimes />
                                            <span>Batal</span>
                                        </button>                                     
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditName(true)}
                                        className={buttonActionClass}>
                                        <FaPen size={10} />
                                        <span>Ubah Nama</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={rowContainerClass}>
                            <div className={infoGroupClass}>
                                <div className={iconWrapperClass}>
                                    <FaEnvelope size={17} />
                                </div>
                                <div>
                                    <p className={labelClass}>Email</p>
                                    <p className="text-base font-medium mt-1 text-gray-300">{user.email}</p>
                                </div>
                            </div>
                            <div className="w-28 hidden sm:block" />
                        </div>
                        
                        <div className={rowContainerClass}>
                            <div className={infoGroupClass}>
                                <div className={iconWrapperClass}>
                                    <FaLock size={17} />
                                </div>
                                <div>
                                    <p className={labelClass}>Password</p>
                                    <p className="text-base font-medium mt-1 text-white/90">********</p>
                                </div>
                            </div>

                            <div className="mt-2 sm:mt-0 pl-14 sm:pl-0">
                                <button
                                onClick={() => setActiveModal("passwordMethod")}
                                className={buttonActionClass}
                                >
                                    <FaPen size={10} />
                                    <span>Ubah Password</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                    <h3 className="text-2xl font-bold text-red-300 mb-2">
                        ZONA BAHAYA
                    </h3>
                    <p className="text-sm text-gray-300/90 mb-4">
                        Setelah menghapus akun KAVA, semua riwayat validasi karier akan hilang permanen.
                    </p>
                    <button
                        onClick={() => setActiveModal("delete")}
                        className="flex items-center space-x-2 bg-red-300 text-red-950 hover:bg-red-600/20 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                        <FaTrashAlt size={14} />
                        <span>Hapus Akun KAVA</span>
                    </button>
                </section>

                <PasswordMethodModal
                    isOpen={activeModal === "passwordMethod"}
                    onClose={closeModal}
                    onChoosePassword={() => setActiveModal("password")}
                    onChooseEmail={handleForgotPasswordByEmail}
                    onSuccessClose={handleForgotPasswordSuccess}
                    loading={modalLoading}
                    error={modalError}
                    successMessage={modalSuccess}
                    email={user.email}
                />

                <PasswordModal
                    isOpen={activeModal === "password"}
                    onClose={closeModal}
                    onSubmit={handleUpdatePassword}
                    error={modalError}
                    loading={modalLoading}
                    formStates={{
                        oldPassword,
                        setOldPassword,
                        newPassword,
                        setNewPassword,
                        confirmPassword,
                        setConfirmPassword
                    }}
                />

                <DeleteAccountModal
                    isOpen={activeModal === "delete"}
                    onClose={closeModal}
                    onConfirm={handleDeleteAccount}
                    error={modalError}
                    loading={modalLoading}
                />
            </div>
        </div>
    );
}

