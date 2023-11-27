import { AddLine, Icon } from '@_koii/koii-styleguide';
import React, { memo, useMemo } from 'react';

import { useAddNewAccountModal } from 'renderer/features/common/hooks/useAddNewAccountModal';

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

  return (
    <>
      {accountsSorted?.map(
        ({ accountName, mainPublicKey, stakingPublicKey, isDefault }) => (
          <AccountItem
            key={accountName}
            mainPublicKey={mainPublicKey}
            accountName={accountName}
            stakingPublicKey={stakingPublicKey}
            isDefault={isDefault}
            columnsLayout="grid-cols-accounts"
          />
        )
      )}

      <button
        onClick={showModal}
        className="flex items-center mt-8 text-sm text-finnieTeal-100 underline-offset-2"
      >
        <Icon source={AddLine} className="h-[18px] w-[18px] mr-2" />
        Get New Key
      </button>
    </>
  );
});

AccountsTable.displayName = 'AccountsTable';
