import React, { memo } from 'react';
import { useDispatch } from 'react-redux';

import AddIconSvg from 'assets/svgs/add-icon-outlined.svg';
import { Button } from 'webapp/components/ui/Button';
import { Table } from 'webapp/components/ui/Table';
import { showModal } from 'webapp/store/actions/modal';

import { AccountType } from '../types';

import KeyManagementTableRow from './KeyManagementTableRow';

const keyManagementTableHeaders = ['Account', 'Address', 'KOII Balance'];

type PropsType = Readonly<{
  accounts: AccountType[];
}>;

const KeyManagement = ({ accounts }: PropsType) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col justify-between h-[100%]">
      <div>
        <Table tableHeaders={keyManagementTableHeaders}>
          {accounts.map((account) => (
            <KeyManagementTableRow key={account.address} account={account} />
          ))}
        </Table>

        <Button
          label="New"
          className="w-auto p-2 mt-10 bg-transparent h-[60px]"
          icon={<AddIconSvg />}
          onClick={() => dispatch(showModal('ADD_NEW_KEY'))}
        />
      </div>

      <div className="text-xs text-finnieOrange">
        Controlling access to your keys is critical to protecting your assets
        stored on the Blockchain.
      </div>
    </div>
  );
};

export default memo(KeyManagement);
