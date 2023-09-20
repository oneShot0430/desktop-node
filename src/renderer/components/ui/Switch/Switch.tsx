import React from 'react';

interface Props {
  id: string;
  isChecked: boolean;
  onSwitch: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

export function Switch({
  id,
  isChecked,
  onSwitch,
  className = '',
  disabled,
}: Props) {
  const dotClasses = `absolute left-0.5 top-0.5 bg-purple-3 w-5 h-5 rounded-full transition peer-checked:transform peer-checked:translate-x-full ${className}s`;
  const switchClasses = `block ${
    (isChecked && 'bg-finnieEmerald-light') || 'bg-finnieGray-light'
  } w-11 h-6 rounded-full ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } transition}`;

  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
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
