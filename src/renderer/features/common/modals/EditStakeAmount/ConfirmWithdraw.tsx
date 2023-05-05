import React, { memo, useState, useEffect } from 'react';

import { ErrorMessage, Button } from 'renderer/components/ui';
import { useStakingAccount } from 'renderer/features/settings/hooks';
import { getAverageSlotTime, TaskService } from 'renderer/services';
import { Task, TaskStatus } from 'renderer/types';
import { ErrorContext, parseRoundTime } from 'renderer/utils';

type PropsType = Readonly<{
  withdrawAmount: number;
  koiiBalance: number;
  onConfirmWithdraw: () => Promise<void>;
  onSuccess: () => void;
  task: Task;
}>;

type ParsedRoundTimeType = {
  unit: 'd' | 'h' | 'm' | 's';
  value: number;
};

export function ConfirmWithdraw({
  onConfirmWithdraw,
  withdrawAmount,
  koiiBalance,
  onSuccess,
  task,
}: PropsType) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [canWithdrawStake, setCanWithdrawStake] = useState(false);
  const [totalRoundTime, setTotalRoundTime] = useState(task.roundTime);
  const [parsedRoundTime, setParsedRoundTime] = useState<ParsedRoundTimeType>({
    value: 0,
    unit: 's',
  });

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();
  const nodeStatus = TaskService.getStatus(task, stakingAccountPublicKey);

  useEffect(() => {
    const verifyWithdrawalAvailability = async () => {
      if (
        nodeStatus === TaskStatus.STOPPED ||
        nodeStatus === TaskStatus.COMPLETE
      ) {
        setCanWithdrawStake(true);
      }
    };
    const getParsedRoundTime = async () => {
      const allSubmissions = Object.values(task.submissions);
      const last3Submissions = allSubmissions.slice(-3);
      const hasSubmittedInLastRound =
        last3Submissions[2] && stakingAccountPublicKey in last3Submissions[2];
      const hasSubmittedInPenultimateRound =
        last3Submissions[1] && stakingAccountPublicKey in last3Submissions[1];
      const roundsLeft = hasSubmittedInLastRound
        ? 3
        : hasSubmittedInPenultimateRound
        ? 2
        : 1;
      const averageSlotTime = await getAverageSlotTime();
      const parsedRoundTime = parseRoundTime(
        task.roundTime * averageSlotTime * roundsLeft
      );
      setTotalRoundTime(task.roundTime * averageSlotTime);
      setParsedRoundTime(parsedRoundTime);
    };

    getParsedRoundTime();
    verifyWithdrawalAvailability();
  }, [task, totalRoundTime, nodeStatus, stakingAccountPublicKey]);

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

  console.log(task);
  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      {!canWithdrawStake ? (
        <div className="font-bold text-lg text-center leading-6 text-finnieBlue tracking-wide max-w-[75%] mb-6">
          Your stake can be withdrawn after 3 rounds. Check back in{' '}
          {Math.ceil(parsedRoundTime.value)}
          {parsedRoundTime.unit}
        </div>
      ) : (
        <div className="mb-3">Confirm the withdrawal amount:</div>
      )}
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
        disabled={!canWithdrawStake}
        loading={isLoading}
        className="bg-finnieRed text-finnieBlue-light-secondary"
      />
    </div>
  );
}

export default memo(ConfirmWithdraw);
