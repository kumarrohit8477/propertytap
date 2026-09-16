import React from 'react';
import './button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  full_width?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  full_width = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variant_class = `ui_button_${variant}`;
  const width_class = full_width ? 'ui_button_full_width' : '';

  return (
    <button
      className={`ui_button ${variant_class} ${width_class} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
