import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';

import ReloadSvg from 'assets/svgs/reload-icon-big.svg';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { useFundNewAccountModal } from 'webapp/features/common';
import { getMainAccountBalance } from 'webapp/services';

type PropsType = {
  onBalanceRefresh?: (balance: string | number) => void;
};

export const RefreshBalance = ({ onBalanceRefresh }: PropsType) => {
  const {
    data: balance,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useQuery(['main-account-balance'], getMainAccountBalance, {
    onSuccess: (data) => {
      if (onBalanceRefresh) {
        onBalanceRefresh(data);
      }
    },
  });

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
      <div className="w-[492px] mb-10">
        Refresh your node balance once the tokens have been sent
        <br /> to your new account.
      </div>
      <div
        className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer"
        onClick={handleRefetch}
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
          <ReloadSvg />
        </div>
      </div>
      <div className="mb-2">Refresh Balance</div>
      <div className="mb-2">
        {checkingBalance
          ? 'Checking balance...'
          : balance === 0 && 'Your balance is 0, try again'}
      </div>
      {error && <ErrorMessage errorMessage="Cant't fetch balance, try again" />}
      <div
        className="mt-2 text-finnieTeal underline inline-block cursor-pointer"
        onClick={showFundAccountModal}
      >
        Fund another way
      </div>
    </div>
  );
};
