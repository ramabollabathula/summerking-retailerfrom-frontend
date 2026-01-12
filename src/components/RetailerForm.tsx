import React from 'react';
import FormHeader from './FormHeader';
import FormCard from './FormCard';

const RetailerForm: React.FC = () => {
  return (
    <div className="form-page-bg py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            {/* Form Header */}
            <FormHeader />

            {/* Distributor Name */}
            <FormCard
              hindiLabel="डिस्ट्रिब्यूटर का नाम"
              englishLabel="Distributor name"
              required
            />

            {/* Location / City / Market */}
            <FormCard
              hindiLabel="लोकेशन / शहर / मार्केट"
              englishLabel="Location/ city/market"
              required
            />

            {/* Salesman Name */}
            <FormCard
              hindiLabel="सेल्समैन का नाम"
              englishLabel="Salesman name"
            />

            {/* Retail Shop Name */}
            <FormCard
              hindiLabel="रिटेल शॉप का नाम"
              englishLabel="Retail shop name"
              required
            />

            {/* Full Retail Shop Address */}
            <FormCard
              hindiLabel="रिटेल शॉप का पूरा पता / पिन कोड"
              englishLabel="Full retail shop address / pin code"
              required
              inputType="long"
            />

            {/* Contact Person Name */}
            <FormCard
              hindiLabel="संपर्क व्यक्ति का नाम"
              englishLabel="Contact person name"
              required
            />

            {/* Contact Person Mobile Number */}
            <FormCard
              hindiLabel="संपर्क व्यक्ति का मोबाइल नंबर"
              englishLabel="Contact person mobile number"
              required
            />

            {/* Shop Age */}
            <FormCard
              hindiLabel="दुकान कितने साल पुरानी है (वर्षों में)"
              englishLabel="Shop age (in years)"
            />

            {/* Upload Shop Photo */}
            <FormCard
              hindiLabel="दुकान की फोटो अपलोड करे"
              englishLabel="Upload shop photo"
              required
              inputType="file"
            />

            {/* Google Map Location Link */}
            <FormCard
              hindiLabel="Google Map लोकेशन की लिंक अपलोड करें"
              englishLabel="Upload google map location link"
              required
              inputType="long"
            />

            {/* Submit Button */}
            <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
              <button
                type="submit"
                className="btn px-4 py-2"
                style={{
                  backgroundColor: 'hsl(262, 83%, 58%)',
                  color: 'white',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  color: 'hsl(262, 83%, 58%)',
                  fontWeight: 500,
                }}
              >
                Clear form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerForm;
