import clsx from 'clsx';
import React, { ChangeEvent } from 'react';

type InputFieldProps = {
  label: string;
  value: string;
  className?: string;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  label,
  value,
  setValue,
  className,
}: InputFieldProps): JSX.Element => {
  return (
    <div className={clsx('flex flex-col', className)}>
      <label className="leading-6 w-full">{label}</label>
      <input
        className="w-full border border-white rounded-finnie-small bg-transparent text-white p-1 shadow-sm"
        value={value}
        onChange={(e) => setValue(e)}
      />
    </div>
  );
};

export default InputField;
