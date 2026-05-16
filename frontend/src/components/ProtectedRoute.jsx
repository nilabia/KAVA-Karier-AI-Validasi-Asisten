import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return <Navigate to="/auth/login" replace/>
    }
    return children;
}

ProtectedRoute.propType = {
    children: PropTypes.node.isRequired
}