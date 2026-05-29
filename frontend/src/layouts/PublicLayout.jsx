import { Outlet, useLocation } from "react-router-dom";
import Headers from "./Headers.jsx";

export default function PublicLayout() {
    const location = useLocation();
    return (
        <div className="min-h-screen flex flex-col">
            <Headers withNav={location.pathname.startsWith("/dashboard") || location.pathname === "/profile"}/>
            <main className="flex-1">
                <Outlet/>
            </main>
        </div>
    )
}
