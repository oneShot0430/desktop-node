import React, { memo, useState } from 'react';

import { ErrorMessage, Button } from 'webapp/components';

type PropsType = Readonly<{
  withdrawAmount: number;
  koiiBalance: number;
  onConfirmWithdraw: () => Promise<void>;
  onSuccess: () => void;
}>;

export const ConfirmWithdraw = ({
  onConfirmWithdraw,
  withdrawAmount,
  koiiBalance,
  onSuccess,
}: PropsType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const handleConfirmWithdrawStake = async () => {
    try {
      setIsLoading(true);
      await onConfirmWithdraw();
      setIsLoading(false);
      onSuccess();
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">Confirm the withdrawal amount::</div>
      <div className="text-4xl text-center text-finnieBlue-dark">
        {withdrawAmount} KOII
      </div>
      {error && <ErrorMessage error={error} />}
      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${koiiBalance} KOII available in your balance`}</div>
      <Button
        label="Confirm Withdraw"
        onClick={handleConfirmWithdrawStake}
        loading={isLoading}
        className="bg-finnieRed text-finnieBlue-light-secondary"
      />
    </div>
  );
};

export default memo(ConfirmWithdraw);
