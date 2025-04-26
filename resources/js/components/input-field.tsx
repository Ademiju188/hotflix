import React from 'react';

interface InputFieldProps {
    type?: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    className = '',
    error = '',
    required = false
}) => {
    return (
        <>
            <input
                type={type}
                name={name}
                className={`sign__input ${className} ${error ? 'is-invalid' : ''}`}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                placeholder={placeholder}
                required={required}
            />
        </>
    );
};

export default InputField;
