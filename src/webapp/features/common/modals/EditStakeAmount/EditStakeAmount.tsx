import { create, useModal } from '@ebay/nice-modal-react';
import React, { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { getKoiiFromRoe, getRoeFromKoii } from 'utils';
import { Button } from 'webapp/components';
import { Modal, ModalContent, ModalTopBar } from 'webapp/features/modals';
import {
  QueryKeys,
  getRewardEarned,
  getMainAccountBalance,
  stakeOnTask,
  withdrawStake,
} from 'webapp/services';
import { Task } from 'webapp/types';

import { useTaskStake } from '../../hooks';

import { AddStake } from './AddStake';
import { ConfirmStake } from './ConfirmStake';
import { ConfirmWithdraw } from './ConfirmWithdraw';
import { SuccessMessage } from './SuccessMessage';
import { Withdraw } from './Withdraw';

enum View {
  Withdraw = 'Withdraw',
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

type NodeInfoType = {
  totalKOII: number;
  totalStaked: number;
  pendingRewards: number;
};

export const EditStakeAmount = create<PropsType>(function EditStakeAmount({
  task,
}) {
  const { taskName, taskManager, publicKey } = task;
  const queryClient = useQueryClient();
  const modal = useModal();
  const [view, setView] = useState<View>(View.SelectAction);
  const [stakeAmount, setStakeAmount] = useState<number>();
  const [withdrawAmount, setWithdrawAmount] = useState<number>();
  const { taskStake } = useTaskStake({ task, publicKey });

  const { data: earnedReward } = useQuery(
    [QueryKeys.taskReward, task.publicKey],
    () => getRewardEarned(task)
  );

  const addStakeMutation = useMutation(
    () => stakeOnTask(publicKey, stakeAmount),
    {
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: [QueryKeys.TaskStake, publicKey],
        });

        const previousStakeAmount = queryClient.getQueryData([
          QueryKeys.TaskStake,
          publicKey,
        ]);

        const previousNodeInfo = queryClient.getQueryData([
          QueryKeys.taskNodeInfo,
        ]);

        const stakeAmountInRoe = getRoeFromKoii(stakeAmount);

        queryClient.setQueryData(
          [QueryKeys.TaskStake, publicKey],
          (oldStakeAmount: number) => {
            const totalStake = stakeAmountInRoe + oldStakeAmount;
            return totalStake;
          }
        );

        queryClient.setQueryData(
          [QueryKeys.taskNodeInfo],
          (oldNodeData: NodeInfoType) => {
            const newNodeInfodata = {
              ...oldNodeData,
              totalStaked: oldNodeData.totalStaked + stakeAmountInRoe,
            };

            return newNodeInfodata;
          }
        );

        return { previousStakeAmount, previousNodeInfo };
      },

      onError: (err, newData, context) => {
        queryClient.setQueryData(
          [QueryKeys.TaskStake, publicKey],
          context.previousStakeAmount
        );
        queryClient.setQueryData(
          [QueryKeys.taskNodeInfo],
          context.previousNodeInfo
        );
      },
    }
  );

  const withdrawStakeMutation = useMutation(
    () => withdrawStake(publicKey, withdrawAmount),
    {
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: [QueryKeys.TaskStake, publicKey],
        });

        const previousStakeAmount = queryClient.getQueryData([
          QueryKeys.TaskStake,
          publicKey,
        ]);

        const previousNodeInfo = queryClient.getQueryData([
          QueryKeys.taskNodeInfo,
        ]);

        const stakeAmountInRoe = getRoeFromKoii(stakeAmount);

        queryClient.setQueryData(
          [QueryKeys.TaskStake, publicKey],
          (oldStakeAmount: number) => {
            const totalStake = stakeAmountInRoe - oldStakeAmount;
            return totalStake;
          }
        );

        queryClient.setQueryData(
          [QueryKeys.taskNodeInfo],
          (oldNodeData: NodeInfoType) => {
            const newNodeInfodata = {
              ...oldNodeData,
              totalStaked: oldNodeData.totalStaked - stakeAmountInRoe,
            };

            return newNodeInfodata;
          }
        );

        return { previousStakeAmount, previousNodeInfo };
      },

      onError: (err, newData, context) => {
        queryClient.setQueryData(
          [QueryKeys.TaskStake, publicKey],
          context.previousStakeAmount
        );
        queryClient.setQueryData(
          [QueryKeys.taskNodeInfo],
          context.previousNodeInfo
        );
      },
    }
  );

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

  const getTitle = useCallback(() => {
    switch (view) {
      case View.SelectAction:
        return 'Edit Stake Amount';
      case View.Withdraw:
        return 'Withdraw Stake';
      case View.Stake:
        return 'Add Stake';
      case View.StakeConfirm:
        return 'Add Stake';
      case View.WithdrawConfirm:
        return 'Withdraw Stake';
      case View.WithdrawSuccess:
        return 'Token Withdraw Succesful';
      case View.StakeSuccess:
        return 'Staked Succesfully';
      default:
        return '';
    }
  }, [view]);

  const showBackButton = view !== View.SelectAction;
  const title = getTitle();
  // before comitting: verify this is ok
  const earnedRewardInKoii = getKoiiFromRoe(earnedReward);
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
        {view === View.Withdraw && (
          <Withdraw
            stakedBalance={myStakeInKoii}
            onWithdraw={(amount) => {
              setWithdrawAmount(amount);
              setView(View.WithdrawConfirm);
            }}
          />
        )}
        {view === View.Stake && (
          <AddStake
            balance={balance}
            onAddStake={(amount) => {
              setStakeAmount(amount);
              setView(View.StakeConfirm);
            }}
          />
        )}
        {view === View.StakeConfirm && (
          <ConfirmStake
            onSuccess={() => setView(View.StakeSuccess)}
            onConfirmAddStake={handleAddStake}
            stakeAmount={stakeAmount}
            koiiBalance={balance}
          />
        )}
        {view === View.WithdrawConfirm && (
          <ConfirmWithdraw
            onSuccess={() => setView(View.WithdrawSuccess)}
            onConfirmWithdraw={handleWithdraw}
            withdrawAmount={withdrawAmount}
            koiiBalance={balance}
          />
        )}
        {view === View.StakeSuccess && (
          <SuccessMessage
            onOkClick={handleClose}
            successMessage={'You successfully staked'}
            stakedAmount={stakeAmount}
          />
        )}
        {view === View.WithdrawSuccess && (
          <SuccessMessage
            onOkClick={handleClose}
            successMessage={
              'You have successfully withdrawn your tokens. To earn more rewards, stake again soon.'
            }
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
                {`You’ve earned ${earnedRewardInKoii} KOII by staking ${myStakeInKoii} tokens on this task.`}
              </p>
              <p>You can withdraw your stake or add more now.</p>
            </div>

            <div className="flex justify-center gap-[60px] ">
              <Button
                onClick={() => setView(View.Withdraw)}
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
