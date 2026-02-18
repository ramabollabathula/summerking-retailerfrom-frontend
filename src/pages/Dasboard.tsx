import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import { API_URLS } from "@/components/Apiurls/Apiurls";
import * as XLSX from "xlsx";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

const downloadExcel = () => {
  if (!retailers.length) {
    alert("Data not loaded yet");
    return;
  }

  const mapRegex = /^https:\/\/www\.google\.com\/maps\?q=/;

  const withMap = retailers.filter(
    (r) => r.google_map_link && mapRegex.test(r.google_map_link)
  );

  const withoutMap = retailers.filter(
    (r) => !r.google_map_link || !mapRegex.test(r.google_map_link)
  );

  const buildSheet = (data: Retailer[]) => {
    const rows = data.map((r, index) => ({
  "S.No": index + 1,
      Distributor: r.distributor_name,
      Location: r.location,
      Salesman: r.salesman_name,
      Shop_Name: r.shop_name,
      Shop_Address: r.shop_address,
      Contact_Person: r.contact_person,
      Mobile: r.contact_mobile,
      Shop_Age: r.shop_age,
      Shop_Image: r.shop_photo
        ? `${API_URLS}/uploads/${r.shop_photo}`
        : "",
      Google_Map: r.google_map_link || "",
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);

    data.forEach((r, i) => {
      const row = i + 2;

      // Shop Image hyperlink (BLUE)
      if (r.shop_photo) {
        const imgUrl = `${API_URLS}/uploads/${r.shop_photo}`;
        sheet[`J${row}`].l = { Target: imgUrl };
        sheet[`J${row}`].s = {
          font: { color: { rgb: "0000FF" }, underline: true },
        };
      }

      // Google Map hyperlink (BLUE)
      if (r.google_map_link) {
        sheet[`K${row}`].l = { Target: r.google_map_link };
        sheet[`K${row}`].s = {
          font: { color: { rgb: "0000FF" }, underline: true },
        };
      }
    });

    return sheet;
  };

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    buildSheet(retailers),
    "All Retailers"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    buildSheet(withMap),
    "With Google Map"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    buildSheet(withoutMap),
    "Without Google Map"
  );

  XLSX.writeFile(workbook, "retailers_report.xlsx");
};

  useEffect(() => {
    fetch(`${API_URLS}/api/retailers`)
      .then((res) => res.json())
      .then((data) => {
        const cleanData = data.map((r: any) => {
          const { timestamp, created_at, ...rest } = r;
          return rest;
        });

        // 🔥 Newest data first
        cleanData.sort((a: any, b: any) => b.id - a.id);

        setRetailers(cleanData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this retailer?")) return;

    try {
      await fetch(`${API_URLS}/api/retailers/${id}`, { method: "DELETE" });
      setRetailers((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Delete failed!");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    return retailers.filter((r) =>
      Object.values(r).some((val) =>
        String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [retailers, searchTerm]);

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

  const totalPages = Math.ceil(sortedData.length / entriesPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const displayColumns = retailers[0]
    ? Object.keys(retailers[0]).filter(
        (col) => col !== "timestamp" && col !== "created_at"
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto py-6">
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
         {/* <button
  onClick={downloadExcel}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  📥 Download
</button> */}
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                {displayColumns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort(col as SortField)}
                  >
                    {col.replaceAll("_", " ").toUpperCase()}
                  </th>
                ))}
                <th className="px-4 py-2 text-left whitespace-nowrap">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={displayColumns.length + 1} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={displayColumns.length + 1} className="text-center py-6">
                    No data found
                  </td>
                </tr>
              ) : (
                currentData.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    {displayColumns.map((col) => {
                      if (col === "shop_photo") {
                        return (
                          <td key={col} className="px-4 py-2">
                            {r.shop_photo && (
                              <a
                                href={`${API_URLS}/uploads/${encodeURIComponent(r.shop_photo)}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={`${API_URLS}/uploads/${encodeURIComponent(r.shop_photo)}`}
                                  style={{ width: "60px", height: "60px" }}
                                  className="object-cover rounded"
                                  alt="Shop"
                                />
                              </a>
                            )}
                          </td>
                        );
                      } else if (col === "google_map_link") {
                        return (
                          <td key={col} className="px-4 py-2">
                            {r.google_map_link && (
                              <a
                                href={
                                  r.google_map_link.startsWith("http")
                                    ? r.google_map_link
                                    : "https://" + r.google_map_link
                                }
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
                        const value = String(r[col as keyof Retailer] ?? "");
                        const truncated =
                          value.length > 50 ? value.substring(0, 25) + "..." : value;

                        return (
                          <td key={col} className="px-4 py-2" title={value}>
                            {truncated}
                          </td>
                        );
                      }
                    })}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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

        <div className="flex justify-between items-center mt-4">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
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
