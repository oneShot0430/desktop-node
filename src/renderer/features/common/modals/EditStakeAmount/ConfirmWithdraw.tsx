import React, { memo, useState } from 'react';

import { ErrorMessage, Button } from 'renderer/components/ui';
import { ErrorContext } from 'renderer/utils';

type PropsType = Readonly<{
  withdrawAmount: number;
  koiiBalance: number;
  onConfirmWithdraw: () => Promise<void>;
  onSuccess: () => void;
}>;

export function ConfirmWithdraw({
  onConfirmWithdraw,
  withdrawAmount,
  koiiBalance,
  onSuccess,
}: PropsType) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const handleConfirmWithdrawStake = async () => {
    try {
      setIsLoading(true);
      await onConfirmWithdraw();
      setIsLoading(false);
      onSuccess();
    } catch (error: any) {
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
      {error && (
        <ErrorMessage error={error} context={ErrorContext.WITHDRAW_STAKE} />
      )}
      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${koiiBalance} KOII available in your balance`}</div>
      <Button
        label="Confirm Withdraw"
        onClick={handleConfirmWithdrawStake}
        loading={isLoading}
        className="bg-finnieRed text-finnieBlue-light-secondary"
      />
    </div>
  );
}

export default memo(ConfirmWithdraw);
