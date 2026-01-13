import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const UploadRetailer: React.FC = () => {
  const [excelData, setExcelData] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // parse rows = {header:1} returns array form
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // skip 1st row & map fields from 2nd row onwards
      const rows = data.slice(1);

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
  google_map_link: r[10] || null
}));


      setExcelData(formatted);
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/bullupload", { data: excelData });
      alert("Retailers uploaded successfully!");
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Upload Retailers XLSX</h3>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {excelData.length > 0 && (
        <button onClick={handleSubmit} style={{ marginTop: 10 }}>
          Upload to Database
        </button>
      )}
    </div>
  );
};

export default UploadRetailer;
