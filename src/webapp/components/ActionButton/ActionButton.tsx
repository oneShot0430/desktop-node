import clsx from 'clsx';
import React from 'react';

const variants = {
  teal: 'finnie-border-teal',
  orange: 'finnie-border-orange',
};

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  logo: React.ElementType;
  name: string;
  variant: keyof typeof variants;
};

const ActionButton = ({
  logo: Logo,
  name,
  variant,
  ...props
}: ActionButtonProps): JSX.Element => {
  return (
    <button
      className={clsx(
        'h-27.5 w-30.5 ml-8 flex flex-col justify-start items-center px-4 pt-4',
        variants[variant]
      )}
      {...props}
    >
      <Logo className="w-9.5 mb-1" />
      <div className="text-center tracking-finnieSpacing-tight">{name}</div>
    </button>
  );
};

export default ActionButton;
