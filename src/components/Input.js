import React from 'react';
import './Input.css' 




const Input = ({ value, onChange, onBlur, onKeyPress, placeholder }) => {
    return (
        <input
            className="custom-input"
            type="text"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
        />
    );
};

export default Input;