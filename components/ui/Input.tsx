import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-[rgb(var(--foreground))]">{label}</label>}
      <input
        className={`
          px-4 py-2 rounded-lg
          bg-[rgb(var(--background-tertiary))]
          border border-[rgb(var(--border))]
          text-[rgb(var(--foreground))]
          placeholder-[rgb(var(--foreground-secondary))]
          focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]
          transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
