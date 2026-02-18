import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/summerking-logo.png";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Get current route

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRetailer = () => {
    navigate("/dashboard");
  };

  const handleDistributor = () => {
    navigate("/distributor-table");
  };

  // 🔥 Active class checker
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const baseBtn =
    "font-medium px-4 py-1 rounded transition duration-200";

  const activeBtn =
    "bg-blue-600 text-white shadow-md";

  const inactiveBtn =
    "bg-white text-blue-600 hover:bg-gray-100";

  return (
    <div className="bg-blue-300 text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="SummerKing Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">

        {/* Retailer */}
        <button
          onClick={handleRetailer}
          className={`${baseBtn} ${
            isActive("/dashboard") ? activeBtn : inactiveBtn
          }`}
        >
          Retailer
        </button>

        {/* Distributor */}
        <button
          onClick={handleDistributor}
          className={`${baseBtn} ${
            isActive("/distributor-table") ? activeBtn : inactiveBtn
          }`}
        >
          Distributor
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 font-medium px-4 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;
