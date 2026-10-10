import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholderSize?: 'text-xs' | 'text-sm' | 'text-base';
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  containerClassName = '',
  placeholderSize = 'text-xs', // Default 12px/13px clean size
  ...props
}) => {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-transparent border border-gray-700 rounded-md text-white 
          placeholder:${placeholderSize} 
          placeholder:text-gray-400 
          placeholder:font-normal 
          placeholder:opacity-70 
          focus:outline-none focus:border-green-500 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
