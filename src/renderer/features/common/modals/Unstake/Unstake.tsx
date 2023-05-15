import { create, useModal } from '@ebay/nice-modal-react';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { Button, ErrorMessage } from 'renderer/components/ui';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';
import { useStakingAccount } from 'renderer/features/settings/hooks';
import { getAverageSlotTime, stopTask, withdrawStake } from 'renderer/services';
import { Task, TaskStatus } from 'renderer/types';
import { parseRoundTime, ParsedRoundTime } from 'renderer/utils';
import { getKoiiFromRoe } from 'utils';

import { useTaskStake } from '../../hooks/useTaskStake';
import { useTaskStatus } from '../../hooks/useTaskStatus';

type PropsType = {
  task: Task;
};

export const Unstake = create<PropsType>(function AddStake({ task }) {
  const { publicKey, isRunning } = task;

  const { taskStake, refetchTaskStake } = useTaskStake({ task });
  const myStakeInKoii = getKoiiFromRoe(taskStake);

  const [canWithdrawStake, setCanWithdrawStake] = useState(false);
  const [totalRoundTime, setTotalRoundTime] = useState(task.roundTime);
  const [parsedRoundTime, setParsedRoundTime] = useState<ParsedRoundTime>({
    value: 0,
    unit: 's',
  });

  const modal = useModal();

  const handleClose = () => {
    modal.resolve(true);
    modal.remove();
  };

  const stopTaskAndUnstake = async () => {
    if (isRunning) {
      await stopTask(publicKey);
    }
    await withdrawStake(publicKey);
  };

  const {
    mutate: unstake,
    isLoading: isUnstaking,
    error: errorUnstaking,
  } = useMutation<any, Error>(stopTaskAndUnstake, {
    onSuccess: () => {
      refetchTaskStake();
      handleClose();
    },
  });

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();

  const { taskStatus } = useTaskStatus({
    task,
    stakingAccountPublicKey,
  });

  useEffect(() => {
    const verifyWithdrawalAvailability = async () => {
      if (
        taskStatus === TaskStatus.STOPPED ||
        taskStatus === TaskStatus.COMPLETE
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
  }, [task, totalRoundTime, taskStatus, stakingAccountPublicKey]);

  const title = canWithdrawStake ? 'Unstake' : 'Finish the Round';
  const buttonAction = canWithdrawStake ? () => unstake() : handleClose;
  const buttonLabel = canWithdrawStake ? 'Unstake' : 'Okay';
  const buttonClasses = canWithdrawStake
    ? 'text-purple-3 bg-white py-4 border-2 border-purple-3'
    : 'text-white bg-purple-4 py-4';
  const waitingTime = `${Math.ceil(parsedRoundTime.value)} ${
    parsedRoundTime.unit
  }`;
  const unavailableText = (
    <div className="px-28 text-lg">
      <p className="mb-3">
        In order to make sure everyone plays fairly, each node must wait 3
        rounds after the last submission to unstake.
      </p>
      <p className="mb-3 font-bold">Check back in about {waitingTime}.</p>
    </div>
  );

  return (
    <Modal>
      <ModalContent className="w-[600px]">
        <ModalTopBar title={title} onClose={handleClose} />

        <div className="flex flex-col items-center justify-center py-8 text-finnieBlue-dark gap-5 h-64">
          {canWithdrawStake ? (
            <>
              <div>
                Do you want to unstake your tokens? <br /> They will be
                available to claim shortly.
              </div>
              <div>
                <p className="text-4xl mt-1.5 text-center">
                  {myStakeInKoii} KOII
                </p>
                <div className="h-12 -mb-10 -mt-2">
                  {errorUnstaking && (
                    <ErrorMessage error={errorUnstaking as Error} />
                  )}
                </div>
              </div>
              <div className="py-2 text-xs text-finnieTeal-700">
                Current KOII staked.
              </div>
            </>
          ) : (
            unavailableText
          )}
          <Button
            label={buttonLabel}
            onClick={buttonAction}
            className={buttonClasses}
            loading={isUnstaking}
            disabled={canWithdrawStake && !myStakeInKoii}
          />
        </div>
      </ModalContent>
    </Modal>
  );
});
