export const forceLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.setItem("sessionMessage", "Sesi login berakhir. Silakan login kembali.");
    window.location.href = "/auth/login";
};

export const handleExpiredSession = (message, status) => {
    const lowerMessage = message?.toLowerCase() || "";

    if (
        status === 401 ||
        lowerMessage.includes("token expired") ||
        lowerMessage.includes("jwt expired") ||
        lowerMessage.includes("unauthorized")
    ) {
        forceLogout();
        return true;
    }

    return false;
};