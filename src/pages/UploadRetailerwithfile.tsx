import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

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
  shop_photo: string | null; // can be Drive URL
  shop_photoFile?: File; // optional local file
  google_map_link: string | null;
}

const UploadRetailer: React.FC = () => {
  const [excelData, setExcelData] = useState<RetailerRow[]>([]);
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);

  // Parse Excel
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
      const rows = data.slice(1); // skip header

      const formatted: RetailerRow[] = rows.map((r: any[]) => ({
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
    };

    reader.readAsBinaryString(file);
  };

 

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // append Excel data
      formData.append("data", JSON.stringify(excelData));

      // append files if provided
      if (photoFiles) {
        Array.from(photoFiles).forEach((file) => {
          formData.append("shop_photos", file);
        });
      }

      const res = await axios.post(
        "http://localhost:5000/api/bullupload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.msg);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Upload Retailers XLSX</h3>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <br />
      <br />
     
      {excelData.length > 0 && (
        <button onClick={handleSubmit} style={{ marginTop: 10 }}>
          Upload to Database
        </button>
      )}
    </div>
  );
};

export default UploadRetailer;
