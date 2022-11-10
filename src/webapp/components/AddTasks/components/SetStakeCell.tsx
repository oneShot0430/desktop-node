import React, { memo, useState, ChangeEventHandler } from 'react';

import { getKoiiFromRoe, getRoeFromKoii } from 'utils';
import { TableCell } from 'webapp/components/ui/Table';

type PropsType = {
  defaultValue: number;
  onStakeValueChange: (value: number) => void;
};

const SetStakeCell = ({ defaultValue, onStakeValueChange }: PropsType) => {
  const [value, setValue] = useState(0);

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: valueInKoii },
  }) => {
    const valueInRoe = getRoeFromKoii(Number(valueInKoii));
    setValue(valueInRoe);
    onStakeValueChange(valueInRoe);
  };

  const valueInKoii = getKoiiFromRoe(value);

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
          value={valueInKoii}
        />
      </div>
    </TableCell>
  );
};

export default memo(SetStakeCell);
