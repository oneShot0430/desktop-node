import React, { useReducer, useCallback } from 'react';
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

type PropsType = Readonly<{ onClose: () => void }>;

const initialState = { show: 'selectAction' };

function reducer(
  state: { show: 'withdraw' | 'stake' | 'selectAction' },
  action: any
) {
  console.log('action', action);
  switch (action.type) {
    case 'withdraw':
      return { show: 'withdraw' };
    case 'stake':
      return { show: 'stake' };
    default:
      return { show: 'selectAction' };
  }
}

export const EditStakeAmountModal = ({ onClose }: PropsType) => {
  const task = useAppSelector((state) => state.modal.modalData.task);

  const [state, dispatch] = useReducer(reducer, initialState);

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
    switch (state.show) {
      case 'selectAction':
        return 'Edit Stake Amount';
      case 'withdraw':
        return 'Withdraw Stake';
      case 'stake':
        return 'Add Stake';
    }
  }, [state.show]);

  const showBackButton = state.show !== 'selectAction';
  const title = getTitle();

  return (
    <div>
      <ModalTopBar
        title={title}
        onClose={onClose}
        onBackClick={() => dispatch({ show: 'selectAction' })}
        showBackButton={showBackButton}
      />
      {state.show === 'withdraw' && (
        <Withdraw stakedBalance={myStake} publicKey={task.publicKey} />
      )}
      {state.show === 'stake' && (
        <AddStake balance={balance} publicKey={task.publicKey} />
      )}
      {state.show === 'selectAction' && (
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
              onClick={() => dispatch({ type: 'withdraw' })}
              label="Withdraw Stake"
              variant="danger"
              className="bg-finnieRed text-finnieBlue-light-secondary"
              disabled={myStake === 0}
            />
            <Button
              onClick={() => dispatch({ type: 'stake' })}
              label="Add More Stake"
            />
          </div>
        </div>
      )}
    </div>
  );
};
