import { Icon } from '@_koii/koii-styleguide';
import React, { useCallback, useState } from 'react';

import ReloadSvg from 'assets/svgs/reload-icon-big.svg';
import { ErrorMessage } from 'renderer/components/ui/ErrorMessage';
import { useFundNewAccountModal } from 'renderer/features/common';
import {
  useMainAccountBalance,
  useRefreshMainAccountBalanceAction,
} from 'renderer/features/settings';

type PropsType = {
  onBalanceRefresh?: (balance: string | number) => void;
};

export function RefreshBalance({ onBalanceRefresh }: PropsType) {
  const {
    accountBalance: mainAccountBalance,
    loadingAccountBalance,
    accountBalanceLoadingError,
    isRefetchingAccountBalance,
  } = useMainAccountBalance({ onSuccess: onBalanceRefresh });
  const { refreshMainAccountBalance } = useRefreshMainAccountBalanceAction();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefetch = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
    /**
     * Invalidate the cache to force a refetch
     */
    refreshMainAccountBalance();
    setTimeout(() => {
      /**
       * Invalidate the cache again after 5 seconds to ensure the balance is updated
       */
      refreshMainAccountBalance();
    }, 5000);
  }, [refreshMainAccountBalance]);

  const renderError = () => {
    if (accountBalanceLoadingError) {
      return <ErrorMessage error="Cant't fetch balance, try again" />;
    }
    return null;
  };

  const { showModal: showFundAccountModal } = useFundNewAccountModal();

  return (
    <div className="flex flex-col items-center h-full pt-44">
      <div className="w-[492px] mb-10 items-center">
        Refresh your node balance once the tokens have been sent
        <br /> to your new account.
      </div>
      <div
        className={`w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer flex items-center justify-center ${
          isAnimating ? 'animate-rotate-once' : ''
        }`}
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
        {loadingAccountBalance || isRefetchingAccountBalance
          ? 'Checking balance...'
          : mainAccountBalance === 0 && 'Your balance is 0, try again'}
      </div>
      {renderError()}
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
