import { trackEvent } from '@aptabase/electron/renderer';
import { create, useModal } from '@ebay/nice-modal-react';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { Button, ErrorMessage, LoadingSpinner } from 'renderer/components/ui';
import { useCloseWithEsc } from 'renderer/features/common/hooks/useCloseWithEsc';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';
import { useStakingAccount } from 'renderer/features/settings/hooks';
import { getAverageSlotTime, stopTask, withdrawStake } from 'renderer/services';
import { Task } from 'renderer/types';
import { parseRoundTime, ParsedRoundTime } from 'renderer/utils';
import { getKoiiFromRoe } from 'utils';

import { useTaskStake } from '../../hooks/useTaskStake';
import { useTaskStatus } from '../../hooks/useTaskStatus';
import { useUnstakingAvailability } from '../../hooks/useUnstakingAvailability';

type PropsType = {
  task: Task;
};

export const Unstake = create<PropsType>(function AddStake({ task }) {
  const { publicKey, isRunning } = task;

  const { taskStake, refetchTaskStake } = useTaskStake({ task });
  const myStakeInKoii = getKoiiFromRoe(taskStake || 0);
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

  useCloseWithEsc({ closeModal: handleClose });

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
      trackEvent('task_unstake', { taskPublicKey: publicKey });
      refetchTaskStake();
      handleClose();
    },
  });

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();

  const { taskStatus } = useTaskStatus({
    task,
    stakingAccountPublicKey,
  });

  const { canUnstake, isLoadingUnstakingAvailability } =
    useUnstakingAvailability({
      task,
      stakingAccountPublicKey,
    });

  useEffect(() => {
    const getParsedRoundTime = async () => {
      try {
        const averageSlotTime = await getAverageSlotTime();
        const parsedRoundTime = parseRoundTime(
          task.roundTime * averageSlotTime * 3
        );
        setTotalRoundTime(task.roundTime * averageSlotTime);
        setParsedRoundTime(parsedRoundTime);
      } catch (error) {
        console.log(error);
      }
    };

    getParsedRoundTime();
  }, [task, totalRoundTime, taskStatus, stakingAccountPublicKey, isRunning]);

  const title = canUnstake ? 'Unstake' : 'Finish the Round';
  const buttonAction = canUnstake ? () => unstake() : handleClose;
  const buttonLabel = canUnstake ? 'Unstake' : 'Okay';
  const buttonClasses = canUnstake
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
          {isLoadingUnstakingAvailability ? (
            <div className="h-full flex items-center">
              <LoadingSpinner className="h-24 w-24" />
            </div>
          ) : (
            <>
              {canUnstake ? (
                <>
                  <div>
                    Do you want to unstake your tokens? <br /> They will be
                    available to claim shortly.
                  </div>
                  <div>
                    <div>
                      <p className="text-4xl mt-1.5 text-center">
                        {myStakeInKoii} KOII
                      </p>
                    </div>
                    <div className="pb-2 text-xs text-finnieTeal-700">
                      Current KOII staked.
                    </div>
                    <div className="h-12 -mb-8 -mt-4">
                      {errorUnstaking && (
                        <ErrorMessage error={errorUnstaking as Error} />
                      )}
                    </div>
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
                disabled={canUnstake && !myStakeInKoii}
              />
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
});
