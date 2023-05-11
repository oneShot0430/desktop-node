import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { LoadingSpinner } from '../LoadingSpinner';

type ButtonVariants = 'primary' | 'danger' | 'neutral';

type ButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariants;
  onlyIcon?: boolean;
  className?: string;
  loading?: boolean;
  tooltip?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

function Button({
  label,
  icon,
  onlyIcon,
  className,
  loading,
  ...rest
}: ButtonProps) {
  if (onlyIcon) {
    const classes = twMerge(
      rest.disabled
        ? 'opacity-60 pointer-events-none cursor-not-allowed'
        : 'cursor-pointer',
      className
    );

    return (
      <div className={rest.disabled ? 'cursor-not-allowed' : ''}>
        <button className={classes} aria-label={label} {...rest}>
          <span>{icon}</span>
        </button>
      </div>
    );
  }

  const classes = twMerge(
    'rounded w-[180px] h-[40px] bg-finnieBlue-light-secondary cursor-pointer',
    className
  );

  return (
    <div className={rest.disabled ? 'cursor-not-allowed' : ''}>
      <button
        className={`${classes} ${
          rest.disabled && 'opacity-60 pointer-events-none cursor-not-allowed'
        } flex items-center justify-center`}
        {...rest}
      >
        <span className={icon && label ? 'pr-2' : ''}>{icon}</span>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <span className="self-center">{label}</span>
        )}
      </button>
    </div>
  );
}

export default Button;
