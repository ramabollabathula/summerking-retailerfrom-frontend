import React, { useState } from "react";
import FormHeader from "./FormHeader";
import FormCard from "./FormCard";

const RetailerForm: React.FC = () => {
  const [form, setForm] = useState({
    distributor_name: "",
    location: "",
    salesman_name: "",
    shop_name: "",
    shop_address: "",
    contact_person: "",
    contact_mobile: "",
    shop_age: "",
    google_map_link: ""
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const link = `https://www.google.com/maps?q=${lat},${lng}`;

        setForm((prev) => ({
          ...prev,
          google_map_link: link
        }));
      },
      () => {
        alert("Location permission denied");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (photo) data.append("shop_photo", photo);

    const res = await fetch("http://localhost:5000/api/retailers", {
      method: "POST",
      body: data
    });

    const json = await res.json();
    alert(json.message);
  };

  return (
    <form onSubmit={handleSubmit} className="form-page-bg py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            <FormHeader />

            <FormCard hindiLabel="डिस्ट्रिब्यूटर का नाम" englishLabel="Distributor name" required name="distributor_name" value={form.distributor_name} onChange={handleChange} />
            <FormCard hindiLabel="लोकेशन / शहर / मार्केट
" englishLabel="Location/ city/market " required name="location" value={form.location} onChange={handleChange} />
            <FormCard hindiLabel="सेल्समैन" englishLabel="Salesman name" name="salesman_name" value={form.salesman_name} onChange={handleChange} />
            <FormCard hindiLabel="रिटेल शॉप का नाम" englishLabel="Retail shop name " required name="shop_name" value={form.shop_name} onChange={handleChange} />
            <FormCard hindiLabel="रिटेल शॉप का पूरा पता /  पिन कोड" englishLabel="Full retail shop address / pin code" inputType="long" name="shop_address" value={form.shop_address} onChange={handleChange} />
            <FormCard hindiLabel="संपर्क व्यक्ति का नाम" englishLabel="Contact person name " name="contact_person" value={form.contact_person} onChange={handleChange} />
            <FormCard hindiLabel="संपर्क व्यक्ति का मोबाइल नंबर
" englishLabel="Contact person mobile number " name="contact_mobile" value={form.contact_mobile} onChange={handleChange} />
            <FormCard hindiLabel="दुकान कितने साल पुरानी है (वर्षों में)" englishLabel="Shop age (in years)" name="shop_age" value={form.shop_age} onChange={handleChange} />

            <FormCard
              hindiLabel="दुकान की फोटो अपलोड करे"
              englishLabel="Upload shop photo"
              inputType="file"
              name="shop_photo"
              onFileChange={(file) => setPhoto(file)}
            />

            <div className="d-flex align-items-end gap-2">
              <div style={{ flex: 1 }}>
                <FormCard
                  hindiLabel="Google Map लोकेशन की लिंक अपलोड करें"
                  englishLabel="Upload google map location link"
                  inputType="long"
                  name="google_map_link"
                  value={form.google_map_link}
                  onChange={handleChange}
                />
              </div>

              <button
                type="button"
                className="btn btn-outline-primary"
                style={{ height: "42px", marginBottom: "16px" }}
                onClick={getCurrentLocation}
              >
                📍
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4">
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RetailerForm;
