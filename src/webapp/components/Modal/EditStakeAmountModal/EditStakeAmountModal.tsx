import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import { Button } from 'webapp/components/ui/Button';
import { useAppSelector } from 'webapp/hooks/reduxHook';
import {
  QueryKeys,
  TaskService,
  getMainAccountBalance,
  getRewardEarned,
} from 'webapp/services';

import { ModalTopBar } from '../ModalTopBar';

import { AddStake } from './AddStake';
import { Withdraw } from './Withdraw';

enum View {
  Withdraw = 'Withdraw',
  Stake = 'Stake',
  SelectAction = 'SelectAction',
}

type PropsType = Readonly<{ onClose: () => void }>;

export const EditStakeAmountModal = ({ onClose }: PropsType) => {
  const [view, setView] = useState<View>(View.SelectAction);
  const task = useAppSelector((state) => state.modal.modalData.task);

  const { data: myStake } = useQuery([QueryKeys.myStake, task.publicKey], () =>
    TaskService.getMyStake(task)
  );

  const { data: earnedReward } = useQuery(
    [QueryKeys.taskReward, task.publicKey],
    () => getRewardEarned(task)
  );

  const { data: balance } = useQuery(QueryKeys.mainAccountBalance, () =>
    getMainAccountBalance()
  );

  const { taskName, taskManager } = task;

  const getTitle = useCallback(() => {
    switch (view) {
      case View.SelectAction:
        return 'Edit Stake Amount';
      case View.Withdraw:
        return 'Withdraw Stake';
      case View.Stake:
        return 'Add Stake';
    }
  }, [view]);

  const showBackButton = view !== View.SelectAction;
  const title = getTitle();

  return (
    <div>
      <ModalTopBar
        title={title}
        onClose={onClose}
        onBackClick={() => setView(View.SelectAction)}
        showBackButton={showBackButton}
      />
      {view === View.Withdraw && (
        <Withdraw stakedBalance={myStake} publicKey={task.publicKey} />
      )}
      {view === View.Stake && (
        <AddStake balance={balance} publicKey={task.publicKey} />
      )}
      {view === View.SelectAction && (
        <div className="flex flex-col justify-center pt-10 text-finnieBlue-dark">
          <div className="mb-[28px] text-lg">
            <div className="font-semibold">{taskName}</div>
            <div>{taskManager}</div>
          </div>

          <div className="flex flex-col justify-center mb-[40px] text-base">
            <p>
              {`You’ve earned ${earnedReward} KOII by staking ${myStake} tokens on this task.`}
            </p>
            <p>You can withdraw your stake or add more now.</p>
          </div>

          <div className="flex justify-center gap-[60px] ">
            <Button
              onClick={() => setView(View.Withdraw)}
              label="Withdraw Stake"
              variant="danger"
              className="bg-finnieRed text-finnieBlue-light-secondary"
              disabled={myStake === 0}
            />
            <Button
              onClick={() => setView(View.Stake)}
              label="Add More Stake"
            />
          </div>
        </div>
      )}
    </div>
  );
};
