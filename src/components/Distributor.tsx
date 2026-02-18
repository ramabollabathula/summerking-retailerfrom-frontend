import React, { useState, useEffect } from "react";
import FormHeader from "./DistributorHeader";
import FormCard from "./FormCard";
import { API_URLS } from "./Apiurls/Apiurls";

const RetailerForm: React.FC = () => {
  const [form, setForm] = useState({
    distributor_name: "",
    mobile: "",
    address: "",
    target_area: "",
    pincode: ""
  });

  const [errors, setErrors] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // Remove error while typing
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  // 🔥 Validation Function
  const validateForm = () => {
    const newErrors: any = {};

    if (!form.distributor_name.trim()) {
      newErrors.distributor_name = "Distributor name is required";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!form.target_area.trim()) {
      newErrors.target_area = "Target area is required";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(form.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setForm({
      distributor_name: "",
      mobile: "",
      address: "",
      target_area: "",
      pincode: ""
    });
    setErrors({});
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URLS}/api/distributorsdetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const json = await res.json();

      if (res.ok) {
        setShowModal(true);
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

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow text-center max-w-md">
          <h3 className="text-xl font-semibold mb-2">Mobile Access Only</h3>
          <p className="text-gray-600">
            This form is available only on mobile devices.
            <br />
            Please open this link on your smartphone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="form-page-bg py-4">
        <div className="container-fluid px-2 px-sm-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7">
              <FormHeader />

              <FormCard
                hindiLabel="डिस्ट्रिब्यूटर का नाम"
                englishLabel="Distributor Name"
                name="distributor_name"
                value={form.distributor_name}
                onChange={handleChange}
              />
              {errors.distributor_name && (
                <small className="text-danger">{errors.distributor_name}</small>
              )}

              <FormCard
                hindiLabel="मोबाइल नंबर"
                englishLabel="Mobile Number"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
              {errors.mobile && (
                <small className="text-danger">{errors.mobile}</small>
              )}

              <FormCard
                hindiLabel="पूरा पता"
                englishLabel="Full Address"
                inputType="long"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}

              <FormCard
                hindiLabel="टारगेट एरिया"
                englishLabel="Target Area"
                name="target_area"
                value={form.target_area}
                onChange={handleChange}
              />
              {errors.target_area && (
                <small className="text-danger">{errors.target_area}</small>
              )}

              <FormCard
                hindiLabel="पिन कोड"
                englishLabel="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
              />
              {errors.pincode && (
                <small className="text-danger">{errors.pincode}</small>
              )}

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

      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h4 className="mb-3">Thank You!</h4>
                <p>Your form has been submitted successfully.</p>
                <button
                  type="button"
                  className="btn btn-primary mt-3"
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
