const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const handleResponse = async (response) => {
    try{
        const data = await response.json();
        return data;
    } catch(error) {
        return {
            status: "error",
            message: "Internal Server Error atau API mati"
        };
    }
}

export const registerUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const verifyEmail = async ({ email, code }) => {
    const response = await fetch (`${BASE_URL}/users/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
    });
    return handleResponse(response);
};

export const loginWithGoogle = async (idToken) => {
    const response = await fetch(`${BASE_URL}/authentications/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
    });
    return handleResponse(response);
}

export const loginUser = async (credentials) => {
    const response = await fetch(`${BASE_URL}/authentications/login`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    return handleResponse(response);
};

export const refreshToken = async() => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    const response = await fetch(`${BASE_URL}/authentications/refresh`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
    });
    return handleResponse(response);
};

export const logoutUser = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    const response = await fetch(`${BASE_URL}/authentications/logout`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
    })
    return handleResponse(response);
};