import React from 'react';

interface Props {
  id: string;
  isChecked: boolean;
  onSwitch: () => void;
  className?: string;
}

export function Switch({ id, isChecked, onSwitch, className = '' }: Props) {
  const dotClasses = `absolute left-0.5 top-0.5 bg-purple-4 w-5 h-5 rounded-full transition peer-checked:transform peer-checked:translate-x-full ${className}`;

  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only peer"
          checked={isChecked}
          onChange={onSwitch}
        />
        <div className="block bg-white w-11 h-6 rounded-full" />
        <div className={dotClasses} />
      </div>
    </label>
  );
}
