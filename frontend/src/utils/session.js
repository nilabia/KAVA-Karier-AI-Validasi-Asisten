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
            lowerMessage.includes("expired token") ||
            lowerMessage.includes("jwt expired") ||
            lowerMessage.includes("invalid token") ||
            lowerMessage.includes("invalid signature")
        );

    if (isExpiredSession) {
        forceLogout();
        return true;
    }

    return false;
};