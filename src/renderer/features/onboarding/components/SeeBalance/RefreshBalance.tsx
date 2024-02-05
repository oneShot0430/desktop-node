import { Icon } from '@_koii/koii-styleguide';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';

import ReloadSvg from 'assets/svgs/reload-icon-big.svg';
import { ErrorMessage } from 'renderer/components/ui';
import { useFundNewAccountModal } from 'renderer/features/common';
import { useMainAccount } from 'renderer/features/settings';
import { getMainAccountBalance, QueryKeys } from 'renderer/services';

type PropsType = {
  onBalanceRefresh?: (balance: string | number) => void;
};

export function RefreshBalance({ onBalanceRefresh }: PropsType) {
  const { data: mainAccountPubKey } = useMainAccount();
  const {
    data: balance,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useQuery<number, Error>(
    [QueryKeys.AccountBalance, mainAccountPubKey],
    getMainAccountBalance,
    {
      onSuccess: (balance) => {
        if (onBalanceRefresh) {
          console.log('###### balance', balance);
          onBalanceRefresh(balance);
        }
      },
      refetchInterval: 3000,
      enabled: !!mainAccountPubKey,
    }
  );

  const { showModal: showFundAccountModal } = useFundNewAccountModal();

  const checkingBalance = useMemo(
    () => isRefetching || isLoading,
    [isLoading, isRefetching]
  );

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col items-center h-full pt-44">
      <div className="w-[492px] mb-10 items-center">
        Refresh your node balance once the tokens have been sent
        <br /> to your new account.
      </div>
      <div
        className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer"
        onClick={handleRefetch}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleRefetch();
          }
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
          <Icon source={ReloadSvg} className="w-24 h-24" />
        </div>
      </div>
      <div className="mb-2">Refresh Balance</div>
      <div className="mb-2">
        {checkingBalance
          ? 'Checking balance...'
          : balance === 0 && 'Your balance is 0, try again'}
      </div>
      {error && <ErrorMessage error="Cant't fetch balance, try again" />}
      <div
        className="inline-block mt-2 underline cursor-pointer text-finnieTeal"
        role="button"
        tabIndex={0}
        onClick={showFundAccountModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            showFundAccountModal();
          }
        }}
      >
        Fund another way
      </div>
    </div>
  );
}
