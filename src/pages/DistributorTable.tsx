import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import * as XLSX from "xlsx";
import { API_URLS } from "@/components/Apiurls/Apiurls";

interface Distributor {
  id: number;
  distributor_name: string;
  mobile: string;
  address: string;
  target_area: string;
  pincode: string;
  created_at?: string;
}

const Dashboard = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  // Excel Download
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Distributors");
    XLSX.writeFile(workbook, "distributors.xlsx");
  };

  // Fetch Data
  useEffect(() => {
    fetch(`${API_URLS}/api/distributorsdetails`)
      .then((res) => res.json())
      .then((data) => {
        setDistributors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  // Delete Distributor
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this distributor?"))
      return;

    try {
      await fetch(`${API_URLS}/api/distributorsdetails/${id}`, {
        method: "DELETE",
      });

      setDistributors((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert("Delete failed!");
    }
  };

  // Copy Text
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  // Search Filter
  const filteredData = useMemo(() => {
    return distributors.filter((d) =>
      Object.values(d).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [distributors, searchTerm]);

  // Sort DESC
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => b.id - a.id);
  }, [filteredData]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / entriesPerPage);

  const currentData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const displayColumns = [
    "distributor_name",
    "mobile",
    "address",
    "target_area",
    "pincode",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <h2 className="text-2xl font-semibold">
            Distributor Details
          </h2>

          <div className="flex items-center space-x-2">

            <button
              onClick={downloadExcel}
              className="bg-green-600 text-white px-3 py-2 rounded-md"
            >
              Download Excel
            </button>

            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            <select
              className="px-2 py-1 border rounded-md"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse">

            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">S.NO</th>

                {displayColumns.map((col) => (
                  <th key={col} className="px-4 py-2 text-left">
                    {col.replaceAll("_", " ").toUpperCase()}
                  </th>
                ))}

                <th className="px-4 py-2 text-center">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={displayColumns.length + 2}
                    className="text-center py-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan={displayColumns.length + 2}
                    className="text-center py-6"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                currentData.map((d, index) => (
                  <tr
                    key={d.id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* Serial Number */}
                    <td className="px-4 py-2">
                      {(currentPage - 1) *
                        entriesPerPage +
                        index +
                        1}
                    </td>

                    {/* Columns */}
                    {displayColumns.map((col) => {
                      const value = String(
                        d[col as keyof Distributor] ?? ""
                      );

                      return (
                        <td
                          key={col}
                          className={`px-4 py-2 ${
                            col === "address"
                              ? "max-w-[220px]"
                              : "max-w-[150px]"
                          }`}
                        >
                          <div className="flex items-center gap-2">

                            <span className="truncate" title={value}>
                              {value}
                            </span>

                            {(col === "address" ||
                              col === "target_area") && (
                              <button
                                onClick={() => copyText(value)}
                                className="text-blue-600 text-sm"
                              >
                                📋
                              </button>
                            )}

                          </div>
                        </td>
                      );
                    })}

                    {/* Delete */}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p>
            Page {currentPage} of {totalPages || 1}
          </p>

          <div className="flex space-x-2">

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
            >
              Prev
            </button>

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
            >
              Next
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;