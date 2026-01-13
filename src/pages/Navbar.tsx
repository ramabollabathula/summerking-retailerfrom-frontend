import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/summerking-logo.png";   // 👈 Brand logo

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBulkUpload = () => {
    navigate("/bulkupload");
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">

      {/* 🔥 Brand section */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="SummerKing Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Right side buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleBulkUpload}
          className="bg-white text-blue-600 font-medium px-4 py-1 rounded hover:bg-gray-100"
        >
          Bulk Upload
        </button>

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
