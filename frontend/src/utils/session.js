export const forceLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    alert("Sesi berakhir. Silahkan login kembali.")

    window.location.href = "/auth/login";
};

export const handleExpiredSession = (message, status) => {
    const lowerMessage = message?.toLowerCase() || "";

    const isExpiredSession =
        status === 401 &&
        (
            lowerMessage.includes("token expired") ||
            lowerMessage.includes("jwt expired") ||
            lowerMessage.includes("unauthorized") ||
            lowerMessage.includes("invalid token")
        );

    if (isExpiredSession) {
        forceLogout();
        return true;
    }

    return false;
};