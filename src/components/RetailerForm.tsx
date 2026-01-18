import React, { useState } from "react";
import FormHeader from "./FormHeader";
import FormCard from "./FormCard";
import { API_URLS } from "./Apiurls/Apiurls";

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
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const clearForm = () => {
    setForm({
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
    setPhoto(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (photo) data.append("shop_photo", photo);
      
      const res = await fetch(`${API_URLS}/api/retailers`, {
        method: "POST",
        body: data
      });

      const json = await res.json();
      
      if (res.ok) {
        // Show success modal
        setShowModal(true);
        // Clear form
        clearForm();
      } else {
        alert(json.message || "Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-page-bg py-4">
       <div className="container-fluid px-2 px-sm-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7">
              <FormHeader />

              <FormCard hindiLabel="डिस्ट्रिब्यूटर का नाम" englishLabel="Distributor name" required name="distributor_name" value={form.distributor_name} onChange={handleChange} />
              <FormCard hindiLabel="लोकेशन / शहर / मार्केट" englishLabel="Location/ city/market " required name="location" value={form.location} onChange={handleChange} />
              <FormCard hindiLabel="सेल्समैन" englishLabel="Salesman name" name="salesman_name" value={form.salesman_name} onChange={handleChange} />
              <FormCard hindiLabel="रिटेल शॉप का नाम" englishLabel="Retail shop name " required name="shop_name" value={form.shop_name} onChange={handleChange} />
              <FormCard hindiLabel="रिटेल शॉप का पूरा पता /  पिन कोड" englishLabel="Full retail shop address / pin code" inputType="long" name="shop_address" value={form.shop_address} onChange={handleChange} />
              <FormCard hindiLabel="संपर्क व्यक्ति का नाम" englishLabel="Contact person name " name="contact_person" value={form.contact_person} onChange={handleChange} />
              <FormCard hindiLabel="संपर्क व्यक्ति का मोबाइल नंबर" englishLabel="Contact person mobile number " name="contact_mobile" value={form.contact_mobile} onChange={handleChange} />
              <FormCard hindiLabel="दुकान कितने साल पुरानी है (वर्षों में)" englishLabel="Shop age (in years)" name="shop_age" value={form.shop_age} onChange={handleChange} />

              <FormCard
                hindiLabel="दुकान की फोटो अपलोड करे"
                englishLabel="Upload shop photo"
                inputType="file"
                name="shop_photo"
                onFileChange={(file) => setPhoto(file)}
              />

              <div style={{ position: "relative" }}>
                <FormCard
                  hindiLabel="Google Map लोकेशन की लिंक अपलोड करें"
                  englishLabel="Upload google map location link"
                  inputType="long"
                  name="google_map_link"
                  value={form.google_map_link}
                  onChange={handleChange}
                />

                <span
                  onClick={getCurrentLocation}
                  style={{
                    position: "absolute",
                    right: "20px",
                    bottom: "28px",
                    cursor: "pointer",
                    fontSize: "30px",
                    userSelect: "none"
                  }}
                >
                  📍
                </span>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Success</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center">
               
                <h4 className="mb-3">Thank You!</h4>
                <p>Your form has been submitted successfully.</p>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={closeModal}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RetailerForm;