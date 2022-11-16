import { AxiosError } from 'axios';
import React, { memo, useMemo } from 'react';

import AddIconSvg from 'assets/svgs/add-icon-outlined.svg';
import { Button } from 'webapp/components/ui/Button';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { useAddNewAccountModal } from 'webapp/features/common/hooks/useAddNewAccountModal';

import { useAccounts } from '../hooks';

import AccountInfo from './AccountInfo';

const AccountsTable = () => {
  const { showModal } = useAddNewAccountModal();

  const { accounts, loadingAccounts, errorAccounts } = useAccounts();

  // isDefault must be first
  const accountsSorted = useMemo(
    () =>
      (accounts ?? []).sort((a, b) => {
        if (a.isDefault && !b.isDefault) {
          return -1;
        }
        if (!a.isDefault && b.isDefault) {
          return 1;
        }
        return 0;
      }),
    [accounts]
  );

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-17rem)]">
      <div className="flex flex-col h-full">
        <div className="grid pb-4 mb-4 font-semibold leading-5 text-white border-b-2 border-white grid-cols-16">
          <div className="col-span-3 col-start-2">Account</div>
          <div className="col-span-5 col-start-6">Address</div>
          <div className="col-span-2 col-start-14">Koii Balance</div>
        </div>
        <div className="overflow-y-auto">
          {loadingAccounts && (
            <div className="flex items-center justify-center h-full text-2xl text-white">
              Loading accounts...
            </div>
          )}
          {errorAccounts && (
            <div className="flex items-center justify-center text-2xl">
              <ErrorMessage
                errorMessage={(errorAccounts as AxiosError).message}
              />
            </div>
          )}
          {accountsSorted?.map(
            ({
              accountName,
              mainPublicKey,
              stakingPublicKey,
              isDefault,
              stakingPublicKeyBalance,
            }) => {
              return (
                <AccountInfo
                  stakingPublicKeyBalance={stakingPublicKeyBalance}
                  key={mainPublicKey}
                  mainPublicKey={mainPublicKey}
                  accountName={accountName}
                  stakingPublicKey={stakingPublicKey}
                  isDefault={isDefault}
                />
              );
            }
          )}

          <Button
            label="New"
            className="w-auto p-2 mr-auto my-6 bg-transparent h-[60px] text-white"
            icon={<AddIconSvg />}
            onClick={showModal}
          />
        </div>
      </div>

      <div className="pt-2 mt-auto text-xs text-finnieOrange">
        Controlling access to your keys is critical to protecting your assets
        stored on the Blockchain.
      </div>
    </div>
  );
};

export default memo(AccountsTable);
