import * as React from 'react';

type ButtonProps = {
  label?: string;
  icon?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({ label, icon, ...rest }: ButtonProps) => {
  return (
    <button {...rest}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
};
