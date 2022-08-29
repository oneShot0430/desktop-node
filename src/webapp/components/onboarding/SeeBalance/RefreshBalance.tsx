import React, { useState } from 'react';
import { useMutation } from 'react-query';

import ReloadSvg from 'assets/svgs/reload-icon-big.svg';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { getMainAccountBalance } from 'webapp/services';

type PropsType = {
  onBalanceRefresh?: (balance: string | number) => void;
};

export const RefreshBalance = ({ onBalanceRefresh }: PropsType) => {
  const [warning, setWarning] = useState(null);
  const { mutate } = useMutation(
    ['main-account-balance'],
    getMainAccountBalance,
    {
      onSuccess: (balance) => {
        if (onBalanceRefresh) {
          onBalanceRefresh(balance);
        }
      },
      onError: (error) => {
        setWarning((error as any).message);
      },
    }
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-[492px] mb-4">
        Refresh your node balance once the tokens have been sent
        <br /> to your new account.
      </div>
      <div
        className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer"
        onClick={() => mutate()}
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
          <ReloadSvg />
        </div>
      </div>
      <div className="mb-2">Refresh Balance</div>
      {warning && (
        <ErrorMessage errorMessage="Cant't fetch balance, try again" />
      )}
    </div>
  );
};
