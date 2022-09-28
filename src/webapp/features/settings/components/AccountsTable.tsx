import React, { memo } from 'react';

import AddIconSvg from 'assets/svgs/add-icon-outlined.svg';
import { Button } from 'webapp/components/ui/Button';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { useAddNewAccountModal } from 'webapp/features/common/hooks/useAddNewAccountModal';

import { useAccounts } from '../hooks';

import AccounInfo from './AccounInfo';

const AccountsTable = () => {
  const { showAddNewAccountModal } = useAddNewAccountModal();

  const { accounts, loadingAccounts, errorAccounts } = useAccounts();

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="flex justify-between pb-4 mb-4 font-semibold leading-5 text-white border-b-2 border-white">
          <div className="w-[220px] pl-12">Account</div>
          <div className="w-[540px]">Adress</div>
          <div className="w-[136px]">Koii Balance</div>
        </div>
        <div className="h-[38vh] overflow-y-auto">
          {loadingAccounts && (
            <div className="flex items-center justify-center h-full text-2xl text-white">
              Loading accounts...
            </div>
          )}
          {errorAccounts && (
            <div className="flex items-center justify-center text-2xl">
              <ErrorMessage
                errorMessage={(errorAccounts as { message: string }).message}
              />
            </div>
          )}
          {(accounts ?? []).map(
            ({
              accountName,
              mainPublicKey,
              stakingPublicKey,
              isDefault,
              stakingPublicKeyBalance,
            }) => {
              return (
                <AccounInfo
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
        </div>

        <Button
          label="New"
          className="w-auto p-2 mt-10 bg-transparent h-[60px] text-white"
          icon={<AddIconSvg />}
          onClick={showAddNewAccountModal}
        />
      </div>

      <div className="text-xs text-finnieOrange">
        Controlling access to your keys is critical to protecting your assets
        stored on the Blockchain.
      </div>
    </div>
  );
};

export default memo(AccountsTable);
