import { create, useModal } from '@ebay/nice-modal-react';
import React, { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { getKoiiFromRoe } from 'utils';
import { Button } from 'webapp/components';
import { Modal, ModalContent, ModalTopBar } from 'webapp/features/modals';
import {
  QueryKeys,
  TaskService,
  getRewardEarned,
  getMainAccountBalance,
  stakeOnTask,
  withdrawStake,
} from 'webapp/services';
import { Task } from 'webapp/types';

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
  const modal = useModal();
  const [view, setView] = useState<View>(View.SelectAction);
  const [stakeAmount, setStakeAmount] = useState<number>();

  const stakeAmountInKoii = getKoiiFromRoe(stakeAmount);

  const { taskName, taskManager, publicKey } = task;

  const queryCache = useQueryClient();

  const { data: myStake } = useQuery([QueryKeys.myStake, publicKey], () =>
    TaskService.getMyStake(task)
  );

  const { data: minStake } = useQuery([QueryKeys.minStake, publicKey], () =>
    TaskService.getMinStake(task)
  );

  const { data: earnedReward } = useQuery(
    [QueryKeys.taskReward, task.publicKey],
    () => getRewardEarned(task)
  );

  const { data: balance } = useQuery([QueryKeys.mainAccountBalance], () =>
    getMainAccountBalance()
  );

  const handleAddStake = async () => {
    // TO DO: expect amount in ROE instead of KOII from the BE
    await stakeOnTask(publicKey, stakeAmountInKoii);
  };

  const handleWithdraw = async () => {
    await withdrawStake(publicKey);
  };

  const handleClose = () => {
    modal.remove();
  };

  const handleAddStakeSuccess = () => {
    setView(View.StakeSuccess);
    queryCache.invalidateQueries([QueryKeys.taskNodeInfo]);
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

  const earnedRewardInKoii = getKoiiFromRoe(earnedReward);
  const myStakeInKoii = getKoiiFromRoe(myStake);

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
        {/*{view === View.WithdrawAmount && (*/}
        {/*  <WithdrawAmount*/}
        {/*    stakedBalance={myStakeInKoii}*/}
        {/*    onWithdraw={(amount) => {*/}
        {/*      // setWithdrawAmount(amount);*/}
        {/*      setView(View.WithdrawConfirm);*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}
        {view === View.Stake && (
          <AddStake
            balance={balance}
            onAddStake={(amount) => {
              setStakeAmount(amount);
              setView(View.StakeConfirm);
            }}
            minStake={minStake}
            currentStake={myStake}
          />
        )}
        {view === View.StakeConfirm && (
          <ConfirmStake
            onSuccess={handleAddStakeSuccess}
            onConfirmAddStake={handleAddStake}
            stakeAmount={stakeAmount}
            koiiBalance={balance}
          />
        )}
        {view === View.WithdrawConfirm && (
          <ConfirmWithdraw
            onSuccess={() => setView(View.WithdrawSuccess)}
            onConfirmWithdraw={handleWithdraw}
            withdrawAmount={myStakeInKoii}
            koiiBalance={balance}
          />
        )}
        {view === View.StakeSuccess && (
          <SuccessMessage
            onOkClick={handleClose}
            successMessage={'You successfully staked'}
            stakedAmount={stakeAmountInKoii}
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
