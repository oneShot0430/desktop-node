import { create, useModal } from '@ebay/nice-modal-react';
import React, { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { GetTaskNodeInfoResponse } from 'models';
import { Button } from 'renderer/components/ui';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';
import {
  QueryKeys,
  getRewardEarned,
  getMainAccountBalance,
  stakeOnTask,
  withdrawStake,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { getKoiiFromRoe } from 'utils';

import { useTaskStake } from '../../hooks/useTaskStake';

import { AddStake } from './AddStake';
import { ConfirmStake } from './ConfirmStake';
import { ConfirmWithdraw } from './ConfirmWithdraw';
import { SuccessMessage } from './SuccessMessage';

enum View {
  WithdrawAmount = 'WithdrawAmount',
  WithdrawConfirm = 'WithdrawConfirm',
  WithdrawSuccess = 'WithdrawSuccess',
  Stake = 'Stake',
  StakeConfirm = 'StakeConfirm',
  StakeSuccess = 'StakeSuccess',
  SelectAction = 'SelectAction',
}

type PropsType = {
  task: Task;
};

export const EditStakeAmount = create<PropsType>(function EditStakeAmount({
  task,
}) {
  const { taskName, taskManager, publicKey } = task;
  const queryClient = useQueryClient();
  const modal = useModal();
  const [view, setView] = useState<View>(View.SelectAction);
  const [stakeAmount, setStakeAmount] = useState<number>();
  const { taskStake } = useTaskStake({ task, publicKey });

  const stakeAmountInKoii = getKoiiFromRoe(stakeAmount as number);
  const minStake = task.minimumStakeAmount;

  const { data: taskEarnedReward } = useQuery(
    [QueryKeys.taskReward, task.publicKey],
    () => getRewardEarned(task)
  );

  const addStakeMutation = useMutation(
    () => stakeOnTask(publicKey, stakeAmount as number),
    {
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: [QueryKeys.TaskStake, publicKey],
        });
      },

      onSuccess: () => {
        queryClient.setQueryData(
          [QueryKeys.TaskStake, publicKey],
          (oldStakeAmount?: number) => {
            const totalStake = (oldStakeAmount || 0) + (stakeAmount || 0);
            return totalStake;
          }
        );

        queryClient.setQueryData<GetTaskNodeInfoResponse>(
          [QueryKeys.taskNodeInfo],
          (oldNodeData?: GetTaskNodeInfoResponse) => {
            const newNodeInfodata = {
              totalKOII: (oldNodeData?.totalKOII || 0) - (stakeAmount || 0),
              totalStaked: (oldNodeData?.totalStaked || 0) + (stakeAmount || 0),
              pendingRewards: oldNodeData?.pendingRewards || 0,
            };

            return newNodeInfodata;
          }
        );
      },
    }
  );

  const withdrawStakeMutation = useMutation(() => withdrawStake(publicKey), {
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.TaskStake, publicKey],
      });
    },

    onSuccess: () => {
      queryClient.setQueryData([QueryKeys.TaskStake, publicKey], () => {
        /**
         * @dev
         * Trying to withdraw all stake, so the value is always 0 after successful withdraw
         */
        return 0;
      });
      queryClient.setQueryData(
        [QueryKeys.taskNodeInfo],
        (oldNodeData?: GetTaskNodeInfoResponse) => {
          const newNodeInfodata = {
            totalKOII: oldNodeData?.totalKOII || 0,
            totalStaked: (oldNodeData?.totalStaked || 0) - (taskStake || 0),
            pendingRewards:
              (oldNodeData?.pendingRewards || 0) + (taskStake || 0),
          };

          return newNodeInfodata;
        }
      );
    },
  });

  const handleAddStake = useCallback(async () => {
    await addStakeMutation.mutateAsync();
  }, [addStakeMutation]);

  const handleWithdraw = useCallback(async () => {
    await withdrawStakeMutation.mutateAsync();
  }, [withdrawStakeMutation]);

  const { data: balance } = useQuery([QueryKeys.mainAccountBalance], () =>
    getMainAccountBalance()
  );

  const handleClose = () => {
    modal.remove();
  };

  const handleAddStakeSuccess = () => {
    setView(View.StakeSuccess);
  };

  const handleWithdrawStakeSuccess = () => {
    setView(View.WithdrawSuccess);
  };

  const getTitle = useCallback(() => {
    switch (view) {
      case View.SelectAction:
        return 'Edit Stake Amount';
      case View.WithdrawAmount:
        return 'Withdraw Stake';
      case View.Stake:
        return 'Add Stake';
      case View.StakeConfirm:
        return 'Add Stake';
      case View.WithdrawConfirm:
        return 'Withdraw Stake';
      case View.WithdrawSuccess:
        return 'Token Withdraw Successful';
      case View.StakeSuccess:
        return 'Staked Successfully';
      default:
        return '';
    }
  }, [view]);

  const showBackButton = view !== View.SelectAction;
  const title = getTitle();

  // const earnedRewardInKoii = getKoiiFromRoe(taskEarnedReward as number);
  const myStakeInKoii = getKoiiFromRoe(taskStake);

  return (
    <Modal>
      <ModalContent className="w-[600px] h-[380px]">
        <ModalTopBar
          title={title}
          onClose={handleClose}
          onBackClick={() => setView(View.SelectAction)}
          showBackButton={showBackButton}
        />
        {/* TODO: Currently not supported */}
        {/* {view === View.WithdrawAmount && ( */}
        {/*  <WithdrawAmount */}
        {/*    stakedBalance={myStakeInKoii} */}
        {/*    onWithdraw={(amount) => { */}
        {/*      // setWithdrawAmount(amount); */}
        {/*      setView(View.WithdrawConfirm); */}
        {/*    }} */}
        {/*  /> */}
        {/* )} */}
        {view === View.Stake && (
          <AddStake
            balance={balance as number}
            onAddStake={(amount) => {
              setStakeAmount(amount);
              setView(View.StakeConfirm);
            }}
            minStake={minStake as number}
            currentStake={taskStake}
          />
        )}
        {view === View.StakeConfirm && (
          <ConfirmStake
            onSuccess={handleAddStakeSuccess}
            onConfirmAddStake={handleAddStake}
            stakeAmount={stakeAmount as number}
            koiiBalance={balance as number}
          />
        )}
        {view === View.WithdrawConfirm && (
          <ConfirmWithdraw
            onSuccess={handleWithdrawStakeSuccess}
            onConfirmWithdraw={handleWithdraw}
            withdrawAmount={myStakeInKoii}
            koiiBalance={balance as number}
          />
        )}
        {view === View.StakeSuccess && (
          <SuccessMessage
            onOkClick={handleClose}
            successMessage="You successfully staked"
            stakedAmount={stakeAmountInKoii}
          />
        )}
        {view === View.WithdrawSuccess && (
          <SuccessMessage
            onOkClick={handleClose}
            successMessage="You have successfully withdrawn your tokens. To earn more rewards, stake again soon."
          />
        )}
        {view === View.SelectAction && (
          <div className="flex flex-col justify-center pt-10 text-finnieBlue-dark">
            <div className="mb-[28px] text-lg">
              <div className="font-semibold">{taskName}</div>
              <div>{taskManager}</div>
            </div>

            <div className="flex flex-col justify-center mb-[40px] text-base">
              <p>
                {`You’ve earned ${taskEarnedReward} KOII by staking ${myStakeInKoii} tokens on this task.`}
              </p>
              <p>You can withdraw your stake or add more now.</p>
            </div>

            <div className="flex justify-center gap-8">
              <Button
                onClick={() => setView(View.WithdrawConfirm)}
                label="Withdraw Stake"
                variant="danger"
                className="bg-finnieRed text-finnieBlue-light-secondary"
                disabled={myStakeInKoii === 0}
              />
              <Button
                onClick={() => setView(View.Stake)}
                label="Add More Stake"
                className="text-white"
              />
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
});
