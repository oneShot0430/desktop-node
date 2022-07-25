import React, { memo, useState } from 'react';

import { Button } from 'webapp/components/ui/Button';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';

type PropsType = Readonly<{
  stakeAmount: number;
  onConfirmAddStake: () => Promise<void>;
  koiiBalance: number;
  onSuccess: () => void;
}>;

const ConfirmStake = ({
  onConfirmAddStake,
  stakeAmount,
  koiiBalance,
  onSuccess,
}: PropsType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleConfirmAddStake = async () => {
    try {
      setIsLoading(true);
      await onConfirmAddStake();
      setIsLoading(false);
      onSuccess();
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">Confirm your stake amount:</div>
      <div className="text-4xl text-center text-finnieBlue-dark">
        {stakeAmount} KOII
      </div>
      {error && <ErrorMessage errorMessage={error} />}
      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${koiiBalance} KOII available in your balance`}</div>
      <Button
        label="Confirm Stake"
        onClick={handleConfirmAddStake}
        loading={isLoading}
      />
    </div>
  );
};

export default memo(ConfirmStake);
