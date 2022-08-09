import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariants = 'primary' | 'danger' | 'neutral';

type ButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariants;
  onlyIcon?: boolean;
  className?: string;
  loading?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({
  label,
  icon,
  onlyIcon,
  className,
  loading,
  ...rest
}: ButtonProps) => {
  if (onlyIcon) {
    return (
      <button aria-label={label} {...rest}>
        <span>{icon}</span>
      </button>
    );
  }

  const classes = twMerge(
    'rounded w-[180px] h-[40px] bg-finnieBlue-light-secondary cursor-pointer z-50',
    className
  );

  return (
    <button
      className={`${classes} text-white ${
        rest.disabled && 'opacity-60'
      } flex items-center justify-center`}
      {...rest}
    >
      {icon}
      {loading ? 'Loading...' : <span className={'self-center'}>{label}</span>}
    </button>
  );
};

export default Button;
