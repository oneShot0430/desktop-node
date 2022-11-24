import React, { useState } from 'react';

import { getKoiiFromRoe } from 'utils';
import { ErrorMessage, Button } from 'webapp/components';

type PropsType = Readonly<{
  stakeAmount: number;
  onConfirmAddStake: () => Promise<void>;
  koiiBalance: number;
  onSuccess: () => void;
}>;

export const ConfirmStake = ({
  onConfirmAddStake,
  stakeAmount,
  koiiBalance,
  onSuccess,
}: PropsType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>(null);
  const stakeAmountInKoii = getKoiiFromRoe(stakeAmount);
  const handleConfirmAddStake = async () => {
    try {
      setIsLoading(true);
      await onConfirmAddStake();

      onSuccess();
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">Confirm your stake amount:</div>
      <div className="text-4xl text-center text-finnieBlue-dark">
        {stakeAmountInKoii} KOII
      </div>
      {error && <ErrorMessage error={error} />}
      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${koiiBalance} KOII available in your balance`}</div>
      <Button
        label="Confirm Stake"
        onClick={handleConfirmAddStake}
        loading={isLoading}
        className="text-white"
      />
    </div>
  );
};
