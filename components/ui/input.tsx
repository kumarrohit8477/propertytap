import React from 'react';
import './input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error_message?: string;
}

export default function Input({
  label,
  error_message,
  className = '',
  id,
  ...props
}: InputProps) {
  const input_id = id || (label ? label.toLowerCase().replace(/\s+/g, '_') : undefined);

  return (
    <div className="ui_input_wrapper">
      {label && (
        <label htmlFor={input_id} className="ui_input_label">
          {label}
        </label>
      )}
      <input
        id={input_id}
        className={`ui_input_field ${className}`}
        {...props}
      />
      {error_message && <span className="ui_input_error">{error_message}</span>}
    </div>
  );
}
