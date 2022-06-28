import React from 'react';

import { useAppSelector } from 'webapp/hooks/reduxHook';

type ModalWithDrawStakeProps = {
  close: () => void;
};

const ModalWithdrawStake = ({
  close,
}: ModalWithDrawStakeProps): JSX.Element => {
  const { taskName, taskManager } = useAppSelector(
    (state) => state.modal.modalData.task
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
      <div className="mb-1 font-semibold leading-7">{taskName}</div>
      <div className="font-normal mb-2.5">{taskManager}</div>
      <div className="font-normal w-128 mb-6.25">
        You’ve earned {'TBD'} KOII tokens from this task so far.
      </div>

      <div className="flex justify-between w-102.75">
        <button
          onClick={close}
          className="flex items-center justify-center finnie-border-blue bg-white w-44.75 h-8 rounded-finnie-small shadow-lg"
        >
          Stay Staked
        </button>
        <button className="flex items-center justify-center border-2 border-finnieRed-500 bg-white w-44.75 h-8 rounded-finnie-small shadow-lg">
          Withdraw Stake
        </button>
      </div>
    </div>
  );
};

export default ModalWithdrawStake;
