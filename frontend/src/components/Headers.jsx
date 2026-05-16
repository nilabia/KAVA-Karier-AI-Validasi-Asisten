import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaSignOutAlt, FaUserCircle, FaUser } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import PropTypes from "prop-types";

export default function Headers({ withNav = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isLoggedIn = !!localStorage.getItem("accessToken");
    const shouldShowNav = withNav && isLoggedIn;
    
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/", {
            replace: true
        });
    }

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

return (
        <header className="w-full h-16 flex items-center justify-between bg-[#002366] shadow-[0px_0px_30px_0px_rgba(163,214,255,0.817)]">
            <Link to="/" className="flex items-center">
                <img 
                    src={logo} 
                    alt=" Logo KAVA | Karier AI Validasi Asisten" 
                    className="h-8 ml-6"
                />
            </Link>
            
            {shouldShowNav && (
                <div className="relative mr-6">
                    <button
                        className="p-2 flex items-center text-white hover:text-blue-300 transition-colors focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="User Menu"
                    >
                        <FaUserCircle size={30} className="md:size[30px]" />
                    </button>

                    {isMenuOpen && (
                        <div>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsMenuOpen(false)}
                            />

                            <div className="absolute right-0 mt-5 z-20">
                                <div className="absolute -top-2 right-5 w-4 h-4 mt-1 bg-[#0b1e42] rotate-45 rounded-sm z-0"/>
                                
                                <div className="relative w-48 bg-[#0b1e42] rounded-xl shadow-2xl overflow-hidden z-10">
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center px-5 py-4 md:py-3 text-gray-200 hover:bg-[#003399] transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <MdSpaceDashboard className="mr-2 text-blue-400" size={14}/>
                                        <span>Dashboard</span>
                                    </Link>
                                    
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-5 py-4 md:py-3 text-gray-200 hover:bg-[#003399] transition-colors border-t border-white/12"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FaUser className="mr-2 text-blue-400" size={14}/>
                                        <span>Akun</span>
                                    </Link>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-5 py-4 md:py-3 text-red-300 hover:bg-red-600/30 transition-colors border-t border-white/12"
                                    >
                                        <FaSignOutAlt className="mr-2" size={14} />
                                        <span>Keluar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

Headers.propTypes = {
    withNav: PropTypes.bool
}