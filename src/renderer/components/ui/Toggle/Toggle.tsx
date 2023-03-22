import React from 'react';

type PropsType = { checked: boolean; onChange: () => void; className?: string };

export function Toggle({ checked, onChange, className = '' }: PropsType) {
  return (
    <label htmlFor="toggle" className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id="toggle"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="block bg-white w-11 h-6 rounded-full" />
        <div
          className={`dot absolute left-0.5 top-0.5 bg-purple-4 w-5 h-5 rounded-full transition peer-checked:transform peer-checked:translate-x-full ${className}`}
        />
      </div>
    </label>
  );
}
