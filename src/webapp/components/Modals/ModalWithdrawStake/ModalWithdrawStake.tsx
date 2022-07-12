import React, { useState } from 'react';

import { useAppSelector } from 'webapp/hooks/reduxHook';
import { withdrawStake } from 'webapp/services';

type ModalWithDrawStakeProps = {
  close: () => void;
};

const ModalWithdrawStake = ({
  close,
}: ModalWithDrawStakeProps): JSX.Element => {
  const [error, setError] = useState<string>(null);
  const { taskName, taskManager, publicKey } = useAppSelector(
    (state) => state.modal.modalData.task
  );

  const handleWithdraw = async () => {
    console.log('####withdrawing...');
    try {
      await withdrawStake(publicKey);
    } catch (error) {
      console.log('### Withdraw error ->', error);
      setError(error);
    }
  };

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

      {error && <div className="text-finnieRed">{error}</div>}

      <div className="flex justify-between w-102.75">
        <button
          onClick={close}
          className="flex items-center justify-center finnie-border-blue bg-white w-44.75 h-8 rounded-finnie-small shadow-lg"
        >
          Stay Staked
        </button>
        <button
          onClick={handleWithdraw}
          className="flex items-center justify-center border-2 border-finnieRed-500 bg-white w-44.75 h-8 rounded-finnie-small shadow-lg"
        >
          Withdraw Stake
        </button>
      </div>
    </div>
  );
};

export default ModalWithdrawStake;
