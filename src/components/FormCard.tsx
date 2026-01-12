import React from 'react';

interface FormCardProps {
  hindiLabel: string;
  englishLabel: string;
  required?: boolean;
  inputType?: 'short' | 'long' | 'file';
  placeholder?: string;
  children?: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({
  hindiLabel,
  englishLabel,
  required = false,
  inputType = 'short',
  placeholder,
  children,
}) => {
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return inputType === 'long' ? 'Long answer text' : 'Short answer text';
  };

  return (
    <div className="form-card p-4">
      <div className="mb-3">
        <span className="form-label-hindi">
          {hindiLabel}
          {required && <span className="form-required">*</span>}
        </span>
      </div>
      <div className="mb-3">
        <span className="form-label-english">{englishLabel}</span>
      </div>
      {children ? (
        children
      ) : inputType === 'file' ? (
        <FileUploadField />
      ) : (
        <input
          type="text"
          className="form-control form-input-placeholder"
          placeholder={getPlaceholder()}
          readOnly
        />
      )}
    </div>
  );
};

const FileUploadField: React.FC = () => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <button className="form-file-btn" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Add file
      </button>
      <a href="#" className="form-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="hsl(210, 100%, 45%)"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
          <path d="M12 7l-5 5h3v4h4v-4h3l-5-5z" />
        </svg>
        View folder
      </a>
    </div>
  );
};

export default FormCard;
