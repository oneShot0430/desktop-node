import React, { memo } from 'react';

import BookmarkIconOutlined from 'assets/svgs/bookmark-icon-outlined.svg';
import BookmarkIconTeal from 'assets/svgs/bookmark-icon-teal.svg';
import EditIconSvg from 'assets/svgs/edit-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { TableCell } from 'webapp/components/ui/Table';

import { AccountType } from '../types';

type PropsType = Readonly<{
  account: AccountType;
}>;

const AccountCell = ({ account: { isDefault, name } }: PropsType) => {
  const handleSetDefaultAccount = () => {
    // TODO: implement set default account
    console.log('###set default accounrt');
  };

  const handleEditAccountName = () => {
    // TODO: implement edit account
    console.log('###edit accounrt');
  };

  return (
    <TableCell>
      <div className="flex flex-row items-center justify-left gap-7">
        <Button
          onClick={handleSetDefaultAccount}
          onlyIcon
          icon={isDefault ? <BookmarkIconOutlined /> : <BookmarkIconTeal />}
        />
        <div className="font-semibold text-m text-finnieTeal">{name}</div>
        <Button
          onClick={handleEditAccountName}
          icon={<EditIconSvg />}
          className="rounded-[50%] w-[24px] h-[24px] bg-finnieTeal-100"
        />
      </div>
    </TableCell>
  );
};

export default memo(AccountCell);
