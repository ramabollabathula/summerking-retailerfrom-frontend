import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBulkUpload = () => {
    navigate("/bulkupload"); // Navigate to the bulk upload page
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">Retailer Management</h1>
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
  );
};

export default Navbar;
