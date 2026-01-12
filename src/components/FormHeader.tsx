import React from 'react';

const FormHeader: React.FC = () => {
  return (
    <div className="form-card-header p-4">
      <h1 className="mb-3" style={{ 
        fontSize: '2rem', 
        fontWeight: 400,
        color: 'hsl(0, 0%, 15%)'
      }}>
        SUMMERKING Electricals – Retailer Information Form
      </h1>
      <p className="mb-1" style={{ 
        fontSize: '0.95rem',
        color: 'hsl(0, 0%, 25%)'
      }}>
        45 वर्षों से भरोसे का नाम।
      </p>
      <p className="mb-1" style={{ 
        fontSize: '0.95rem',
        color: 'hsl(0, 0%, 25%)'
      }}>
        ग्राहक संतुष्टि, आसान रिप्लेसमेंट और होम सर्विस।
      </p>
      <p className="mb-0" style={{ 
        fontSize: '0.95rem',
        color: 'hsl(0, 0%, 25%)'
      }}>
        Ghar Ghar SUMMERKING | Har Ghar SUMMERKING
      </p>
    </div>
  );
};

export default FormHeader;
