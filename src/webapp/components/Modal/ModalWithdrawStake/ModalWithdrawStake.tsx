import React from 'react';

import { useAppSelector } from 'webapp/hooks/reduxHook';

type ModalWithDrawStakeProps = {
  close: () => void;
};

const ModalWithdrawStake = ({
  close,
}: ModalWithDrawStakeProps): JSX.Element => {
  const { name, creator, rewardEarned } = useAppSelector(
    (state) => state.modal.modalData.taskInfo
  );

  return (
    <div className="flex flex-col items-center text-finnieBlue tracking-finnieSpacing-wider">
      <div className="text-2xl font-semibold  mb-2.5 leading-8">
        Withdraw Stake
      </div>
      <div className="font-normal w-128 mb-6.25">
        Are you sure you want to withdraw your stake from this task? You can’t
        earn any rewards if you unstake your tokens.
      </div>
      <div className="font-semibold mb-1 leading-7">{name}</div>
      <div className="font-normal mb-2.5">{creator}</div>
      <div className="font-normal w-128 mb-6.25">
        You’ve earned {rewardEarned} KOII tokens from this task so far.
      </div>

      <div className="flex justify-between w-102">
        <button
          onClick={close}
          className="flex items-center justify-center finnie-border-blue w-44.75 h-8 rounded-finnie-small shadow-lg"
        >
          Stay Staked
        </button>
        <button className="flex items-center justify-center finnie-border-blue w-44.75 h-8 rounded-finnie-small shadow-lg">
          Withdraw Stake
        </button>
      </div>
    </div>
  );
};

export default ModalWithdrawStake;
