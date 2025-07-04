import type { FC } from 'react';
import './FormInputStyle.css'

interface FormInputProps {
    icon: React.ElementType;
    id: string;
    type: string;
    placeholder: string;
    label: string;
    required?: boolean;
}

const FormInput: FC<FormInputProps> = ({ icon: Icon, id, type, placeholder, label, required = false }) => (
    <div className="form-input-container">
        <label htmlFor={id} className="form-label">
            {label}
            {required && <span className="required-asterisk">*</span>}
        </label>
        <div className="input-wrapper">
            <span className="input-icon">
                <Icon className="icon" />
            </span>
            <input 
                type={type} 
                id={id} 
                className="form-input" 
                placeholder={placeholder} 
                required={required}
            />
        </div>
    </div>
);

export default FormInput