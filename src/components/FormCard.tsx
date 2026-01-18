import React from "react";

interface FormCardProps {
  hindiLabel: string;
  englishLabel: string;
  required?: boolean;
  inputType?: "short" | "long" | "file";
  placeholder?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange?: (file: File) => void;
}

const FormCard: React.FC<FormCardProps> = ({
  hindiLabel,
  englishLabel,
  required = false,
  inputType = "short",
  placeholder,
  name,
  value,
  onChange,
  onFileChange
}) => {
  return (
    <div className="form-card p-3 p-md-4">
      <div className="mb-1">
        <span className="form-label-hindi">
          {hindiLabel} {required && <span className="form-required">*</span>}
        </span>
      </div>
      <div className="mb-2">
        <span className="form-label-english">{englishLabel}</span>
      </div>

      {inputType === "file" ? (
        <input
          type="file"
          className="form-control"
          onChange={(e) => onFileChange(e.target.files![0])}
        />
      ) : inputType === "long" ? (
        <textarea
          className="form-control"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      ) : (
        <input
          type="text"
          className="form-control"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default FormCard;
