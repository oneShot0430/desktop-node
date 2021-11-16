import clsx from 'clsx';
import React from 'react';

const variants = {
  teal: 'border-finnieTeal-100',
  orange: 'border-finnieOrange',
};

type ActionButtonProps = {
  logo: React.ElementType;
  name: string;
  variant: keyof typeof variants;
};

const ActionButton = ({ logo: Logo, name, variant }: ActionButtonProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'h-27.5 w-30.5 ml-8 flex flex-col justify-start items-center cursor-pointer border rounded-finnie px-4 pt-4',
        variants[variant]
      )}
    >
      <Logo className="w-9.5 mb-1" />
      <div className="text-center tracking-finnieSpacing-tight">{name}</div>
    </div>
  );
};

export default ActionButton;
