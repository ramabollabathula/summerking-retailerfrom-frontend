import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";

interface Retailer {
  id: number;
  distributor_name: string;
  location: string;
  salesman_name: string;
  shop_name: string;
  shop_address: string;
  contact_person: string;
  contact_mobile: string;
  shop_age: number;
  shop_photo: string | null;
  google_map_link: string;
}

type SortField = keyof Retailer;
type SortDirection = "asc" | "desc";

const Dashboard = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  // Fetch retailers
  useEffect(() => {
    fetch("http://localhost:5000/api/retailers")
      .then(res => res.json())
      .then(data => {
        const cleanData = data.map((r: any) => {
          const { timestamp, created_at, ...rest } = r;
          return rest;
        });
        setRetailers(cleanData);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  // Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered data
  const filteredData = useMemo(() => {
    return retailers.filter(r =>
      Object.values(r).some(val =>
        String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [retailers, searchTerm]);

  // Sorted data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedData.length / entriesPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const displayColumns = retailers[0]
    ? Object.keys(retailers[0]).filter(col => col !== "timestamp" && col !== "created_at")
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto py-6">
        {/* Header + Search + Entries dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <h2 className="text-2xl font-semibold">Retailers Database</h2>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search any field..."
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
            />
            <select
              className="px-2 py-1 border rounded-md"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to page 1
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
                {displayColumns.map(col => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort(col as SortField)}
                  >
                    {col.replaceAll("_", " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>


            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={displayColumns.length} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={displayColumns.length} className="text-center py-6">
                    No data found
                  </td>
                </tr>
              ) : (
                currentData.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    {displayColumns.map(col => {
                      if (col === "shop_photo") {
                        return (
                          <td key={col} className="px-4 py-2">
                            {r.shop_photo && (
                              <img
                                src={`http://localhost:5000${r.shop_photo}`}
                                width={60}
                                height={60}
                                className="object-cover rounded"
                              />
                            )}
                          </td>
                        );
                      } else if (col === "google_map_link") {
                        return (
                          <td key={col} className="px-4 py-2">
                            {r.google_map_link && (
                              <a
                                href={r.google_map_link.startsWith("http") ? r.google_map_link : "https://" + r.google_map_link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Map
                              </a>
                            )}
                          </td>
                        );
                      } else {
                        return (
                          <td key={col} className="px-4 py-2">
                            {r[col as keyof Retailer]}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
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
