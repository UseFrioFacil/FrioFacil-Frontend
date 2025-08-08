import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import './FormInputStyle.css';

interface PasswordInputProps {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const PasswordInput: FC<PasswordInputProps> = ({ 
    id, 
    label, 
    placeholder = "Sua senha",
    required = false, 
    value, 
    onChange,
    className = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`form-input-container ${className}`}>
            <label htmlFor={id} className="form-label">
                {label}
                {required && <span className="required-asterisk">*</span>}
            </label>
            <div className="input-wrapper">
                <div className="input-icon">
                    <Lock size={20} />
                </div>
                <input 
                    type={showPassword ? "text" : "password"}
                    id={id}
                    className="form-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
