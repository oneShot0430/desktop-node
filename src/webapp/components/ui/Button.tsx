import * as React from 'react';

type ButtonVariants = 'primary' | 'danger';

type ButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariants;
  onlyIcon?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({
  label,
  icon,
  variant,
  onlyIcon,
  ...rest
}: ButtonProps) => {
  const getButtonColors = (variant: ButtonVariants) => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'finnieBlue-light-secondary',
          text: 'white',
        };
      case 'danger':
        return {
          bg: 'finnieRed',
          text: 'finnieBlue-light-secondary',
        };
      default:
        return {
          bg: 'finnieBlue-light-secondary',
          text: 'white',
        };
    }
  };

  if (onlyIcon) {
    return (
      <button aria-label={label} {...rest}>
        <span>{icon}</span>
      </button>
    );
  }

  const { bg, text } = getButtonColors(variant);

  return (
    <button
      className={`rounded w-[180px] h-[40px] bg-${bg} border border-finnieBlue-light-secondary`}
      {...rest}
    >
      <span>{icon}</span>
      <span className={`text-${text} self-center`}>{label}</span>
    </button>
  );
};
