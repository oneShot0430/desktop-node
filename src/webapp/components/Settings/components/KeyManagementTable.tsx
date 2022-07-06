import React, { memo } from 'react';

import { Table } from 'webapp/components/ui/Table';

import { AccountType } from '../types';

import KeyManagementTableRow from './KeyManagementTableRow';

const keyManagementTableHeaders = ['Account', 'Address', 'KOII Balance'];

type PropsType = Readonly<{
  accounts: AccountType[];
}>;

const KeyManagement = ({ accounts }: PropsType) => {
  return (
    <Table tableHeaders={keyManagementTableHeaders}>
      {accounts.map((account) => (
        <KeyManagementTableRow key={account.address} account={account} />
      ))}
    </Table>
  );
};

export default memo(KeyManagement);
