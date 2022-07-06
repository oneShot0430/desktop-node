import React, { memo } from 'react';

import CopyIconSvg from 'assets/svgs/copy-icon.svg';
import KeyIconSvg from 'assets/svgs/key-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { TableCell } from 'webapp/components/ui/Table';

type PropsType = Readonly<{
  address: string;
}>;

const AddressCell = ({ address }: PropsType) => {
  return (
    <TableCell>
      <div className="flex items-center gap-3">
        {address}
        <Button
          icon={<CopyIconSvg />}
          className="rounded-[50%] w-[24px] h-[24px] bg-finnieTeal-100"
        />
        <Button
          icon={<KeyIconSvg className="w-[14px] h-[14px]" />}
          className="rounded-[50%] w-[24px] h-[24px] bg-finnieEmerald-light"
        />
      </div>
    </TableCell>
  );
};

export default memo(AddressCell);
