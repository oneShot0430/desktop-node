import React, { memo } from 'react';

import DeleteIconSvg from 'assets/svgs/delete-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { TableCell, TableRow } from 'webapp/components/ui/Table';

import { AccountType } from '../types';

import AccountCell from './AccountCell';
import AddressCell from './AddressCell';

type PropsType = Readonly<{
  account: AccountType;
}>;

const KeyManagementTableRow = ({ account }: PropsType) => {
  const { address, balance } = account;

  const handleDeleteAccount = () => {
    // TODO: implement delete account
    console.log('###delete account');
  };

  return (
    <TableRow>
      <AccountCell account={account} />
      <AddressCell address={address} />
      <TableCell className="w-[160px]">{balance}</TableCell>
      <TableCell>
        <Button
          onClick={handleDeleteAccount}
          icon={<DeleteIconSvg />}
          className="rounded-[50%] w-[24px] h-[24px] bg-finnieRed"
        />
      </TableCell>
    </TableRow>
  );
};

export default memo(KeyManagementTableRow);
