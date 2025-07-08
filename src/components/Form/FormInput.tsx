import type { FC, ChangeEvent } from 'react';
import './FormInputStyle.css';

interface FormInputProps {
    icon: React.ElementType;
    id: string;
    type: string;
    placeholder: string;
    label: string;
    required?: boolean;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<FormInputProps> = ({ 
    icon: Icon, 
    id, 
    type, 
    placeholder, 
    label, 
    required = false, 
    value, 
    onChange 
}) => (
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
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

export default FormInput;