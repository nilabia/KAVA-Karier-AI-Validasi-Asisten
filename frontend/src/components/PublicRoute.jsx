import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PropTypes from "prop-types";

export default function PublicRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    if (token) {
        return <Navigate to="/dashboard" replace/>
    }
    return children;
}

PublicRoute.propType = {
    children: PropTypes.node.isRequired
}