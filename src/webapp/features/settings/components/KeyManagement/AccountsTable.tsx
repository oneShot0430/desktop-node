import { AddLine, Icon } from '@_koii/koii-styleguide';
import React, { memo, useMemo } from 'react';

import { Button, Table } from 'webapp/components/ui';
import { useAddNewAccountModal } from 'webapp/features/common/hooks/useAddNewAccountModal';

import { useAccounts } from '../../hooks';

import { AccountItem } from './AccountItem';

export const AccountsTable = memo(() => {
  const { showModal } = useAddNewAccountModal();

  const { accounts, loadingAccounts, accountsError } = useAccounts();

  // isDefault must be first
  const accountsSorted = useMemo(
    () =>
      (accounts ?? []).sort((a) => {
        if (a.isDefault) {
          return -1;
        }
        return 0;
      }),
    [accounts]
  );

  const headers = [
    { title: '' },
    { title: 'Account' },
    { title: 'Address' },
    { title: 'KOII balance' },
  ];

  return (
    <>
      <Table
        headers={headers}
        columnsLayout="grid-cols-accounts-headers pr-6"
        isLoading={loadingAccounts}
        error={accountsError}
      >
        {accountsSorted?.map(
          ({
            accountName,
            mainPublicKey,
            stakingPublicKey,
            isDefault,
            stakingPublicKeyBalance,
          }) => (
            <AccountItem
              key={accountName}
              stakingPublicKeyBalance={stakingPublicKeyBalance}
              mainPublicKey={mainPublicKey}
              accountName={accountName}
              stakingPublicKey={stakingPublicKey}
              isDefault={isDefault}
              columnsLayout="grid-cols-accounts"
            />
          )
        )}

        <Button
          label="New"
          className="w-auto p-2 mr-auto my-6 bg-transparent h-[60px] text-white"
          icon={<Icon source={AddLine} className="h-[34px] w-[34px] mr-2" />}
          onClick={showModal}
        />
      </Table>

      <div className="pt-3 mt-auto text-xs text-finnieOrange">
        Controlling access to your keys is critical to protecting your assets
        stored on the Blockchain.
      </div>
    </>
  );
});

AccountsTable.displayName = 'AccountsTable';
