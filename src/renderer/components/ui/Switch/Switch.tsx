import React from 'react';

interface Props {
  id: string;
  isChecked: boolean;
  onSwitch: () => void;
  className?: string;
  checkedClass?: string;
  disabled?: boolean;
}

export function Switch({
  id,
  isChecked,
  onSwitch,
  className = '',
  checkedClass,
  disabled,
}: Props) {
  const dotClasses = `absolute left-0.5 top-0.5 bg-purple-4 w-5 h-5 rounded-full transition peer-checked:transform peer-checked:translate-x-full ${className}`;
  const switchClasses = `block ${
    (isChecked && checkedClass) || 'bg-white'
  } w-11 h-6 rounded-full ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } transition}`;

  return (
    <label htmlFor={id} className="flex items-center">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only peer"
          checked={isChecked}
          onChange={onSwitch}
          disabled={disabled}
        />
        <div className={switchClasses} />
        <div className={dotClasses} />
      </div>
    </label>
  );
}
