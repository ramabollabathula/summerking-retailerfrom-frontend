import React from "react";
import banner from "../assets/summerking-logo.png";

const FormHeader: React.FC = () => {
  return (
    <div className="form-card-header p-3 p-md-4">

      {/* Banner Image */}
      <img
        src={banner}
        alt="Summerking Banner"
        style={{
          width: "100%",
          maxHeight: "220px",
          objectFit: "contain",
          marginBottom: "20px",
          borderRadius: "8px"
        }}
      />

      <h1
        className="mb-3"
        style={{
          fontSize: "1.5rem",
          fontWeight: 400,
          color: "hsl(0, 0%, 15%)"
        }}
      >
        SUMMERKING Electricals – Retailer Information Form
      </h1>

      <p className="mb-1" style={{ fontSize: "0.95rem", color: "hsl(0, 0%, 25%)" }}>
        45 वर्षों से भरोसे का नाम।
      </p>

      <p className="mb-1" style={{ fontSize: "0.95rem", color: "hsl(0, 0%, 25%)" }}>
        ग्राहक संतुष्टि, आसान रिप्लेसमेंट और होम सर्विस।
      </p>

      <p className="mb-0" style={{ fontSize: "0.95rem", color: "hsl(0, 0%, 25%)" }}>
        Ghar Ghar SUMMERKING | Har Ghar SUMMERKING
      </p>
    </div>
  );
};

export default FormHeader;
