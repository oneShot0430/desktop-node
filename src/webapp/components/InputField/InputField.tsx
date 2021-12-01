import clsx from 'clsx';
import React, { ChangeEvent } from 'react';

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  className?: string;
  type: 'input' | 'textArea';
  setValue: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const InputField = ({
  label,
  name,
  value,
  setValue,
  type,
  className,
}: InputFieldProps): JSX.Element => {
  return (
    <div className={clsx('flex flex-col', className)}>
      <label className="leading-6 w-full">{label}</label>
      {type === 'input' && (
        <input
          name={name}
          className="w-full border border-white rounded-finnie-small bg-transparent text-white p-1 shadow-sm"
          value={value}
          onChange={(e) => setValue(e)}
        />
      )}
      {type === 'textArea' && (
        <textarea
          name={name}
          className="flex-grow resize-none w-full border border-white rounded-finnie-small bg-transparent text-white p-1 shadow-sm"
          value={value}
          onChange={(e) => setValue(e)}
        />
      )}
    </div>
  );
};

export default InputField;
