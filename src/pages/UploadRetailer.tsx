import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import Navbar from "./Navbar"; 
import { useNavigate } from "react-router-dom";

interface RetailerRow {
  timestamp: string | null;
  distributor_name: string | null;
  location: string | null;
  salesman_name: string | null;
  shop_name: string | null;
  shop_address: string | null;
  contact_person: string | null;
  contact_mobile: string | null;
  shop_age: number | null;
  shop_photo: string | null;
  google_map_link: string | null;
}

const UploadRetailer: React.FC = () => {
    const navigate = useNavigate();
  const [excelData, setExcelData] = useState<RetailerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle excel parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const rows = data.slice(1); // skip header row

      const formatted = rows.map((r: any[]) => ({
        timestamp: r[0] || null,
        distributor_name: r[1] || null,
        location: r[2] || null,
        salesman_name: r[3] || null,
        shop_name: r[4] || null,
        shop_address: r[5] || null,
        contact_person: r[6] || null,
        contact_mobile: r[7] || null,
        shop_age: r[8] || null,
        shop_photo: r[9] || null,
        google_map_link: r[10] || null,
      }));

      setExcelData(formatted);
      setSuccess(false);
    };

    reader.readAsBinaryString(file);
  };

  // handle submit
  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const res = await axios.post("http://localhost:5000/api/bullupload", {
        data: excelData,
      });

      if (res.data.success || res.data.msg) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Bulk Upload Retailers</h2>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border border-gray-300 p-2 rounded-md"
        />

        {excelData.length > 0 && (
          <>
            {/* <h3 className="mt-6 mb-2 text-xl font-semibold">
              Preview Extracted Data
            </h3>

            <div className="overflow-auto max-h-96 border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="p-2 border">Distributor</th>
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Salesman</th>
                    <th className="p-2 border">Shop Name</th>
                    <th className="p-2 border">Mobile</th>
                    <th className="p-2 border">Map Link</th>
                  </tr>
                </thead>
                <tbody>
                  {excelData.slice(0, 30).map((row, i) => (
                    <tr key={i} className="odd:bg-gray-50">
                      <td className="p-2 border">{row.distributor_name}</td>
                      <td className="p-2 border">{row.location}</td>
                      <td className="p-2 border">{row.salesman_name}</td>
                      <td className="p-2 border">{row.shop_name}</td>
                      <td className="p-2 border">{row.contact_mobile}</td>
                      <td className="p-2 border">
                        {row.google_map_link ? (
                          <a
                            href={row.google_map_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}

            <div className="mt-6 flex items-center gap-4">
                 <button
    onClick={() => navigate("/dashboard")}
    className="px-6 py-2 rounded-md border border-gray-400 hover:bg-gray-200"
  >
    Cancel
  </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded-md text-white font-semibold flex items-center gap-2 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                )}
                {loading ? "Uploading..." : "Submit to Database"}
              </button>

              {success && (
                <span className="text-green-600 font-semibold">
                  ✔ Data stored successfully!
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadRetailer;
