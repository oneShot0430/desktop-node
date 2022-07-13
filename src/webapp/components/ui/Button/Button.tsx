import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariants = 'primary' | 'danger' | 'neutral';

type ButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariants;
  onlyIcon?: boolean;
  className?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({ label, icon, onlyIcon, className, ...rest }: ButtonProps) => {
  if (onlyIcon) {
    return (
      <button aria-label={label} {...rest}>
        <span>{icon}</span>
      </button>
    );
  }

  const classes = twMerge(
    'rounded w-[180px] h-[40px] bg-finnieBlue-light-secondary',
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
      <span className={'self-center'}>{label}</span>
    </button>
  );
};

export default Button;