import React, { memo, useState } from 'react';

import { TableCell } from 'webapp/components/ui/Table';

type PropsType = {
  defaultValue: string;
  onStakeValueChange: (value: string) => void;
};

const SetStakeCell = ({ defaultValue, onStakeValueChange }: PropsType) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onStakeValueChange(e.target.value);
  };

  return (
    <TableCell>
      <div>
        <input
          min="0"
          pattern="[0-9]+"
          type="number"
          onChange={handleChange}
          className="w-24 h-8 p-2 bg-gray-200 rounded text-finnieBlue-dark"
          defaultValue={defaultValue}
          value={value}
        />
      </div>
    </TableCell>
  );
};

export default memo(SetStakeCell);
