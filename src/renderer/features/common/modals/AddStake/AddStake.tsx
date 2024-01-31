import { create, useModal } from '@ebay/nice-modal-react';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { Button, ErrorMessage } from 'renderer/components/ui';
import { useCloseWithEsc } from 'renderer/features/common/hooks/useCloseWithEsc';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';
import { useMainAccount } from 'renderer/features/settings/hooks/useMainAccount';
import {
  QueryKeys,
  getMainAccountBalance,
  stakeOnTask,
  startTask,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { getKoiiFromRoe, getRoeFromKoii } from 'utils';

import KoiiInput from './KoiiInput';

enum Step {
  Add = 'Add',
  Confirm = 'Confirm',
}

type PropsType = {
  task: Task;
};

export const AddStake = create<PropsType>(function AddStake({ task }) {
  const { publicKey, minimumStakeAmount: minStake, isRunning } = task;

  const modal = useModal();

  const [step, setStep] = useState<Step>(Step.Add);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [error, setError] = useState('');

  const stakeAndRun = async () => {
    await stakeOnTask(publicKey, getRoeFromKoii(stakeAmount));
    if (!isRunning) {
      await startTask(publicKey);
    }
  };

  const {
    mutate: addStake,
    isLoading: isStaking,
    error: errorStaking,
  } = useMutation(stakeAndRun, {
    onSuccess: () => {
      handleClose();
    },
  });

  const handleClickAddStake = () => setStep(Step.Confirm);
  const { data: mainAccountPublicKey } = useMainAccount();

  const { data: balance = 0 } = useQuery(
    [QueryKeys.AccountBalance, mainAccountPublicKey],
    () => getMainAccountBalance()
  );

  const handleClose = () => {
    modal.resolve(true);
    modal.remove();
  };

  useCloseWithEsc({ closeModal: handleClose });

  const showBackButton = step === Step.Confirm;

  const minStakeInKoii = getKoiiFromRoe(minStake);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const stakeToAdd = +e.target.value;
    const stakeToAddInRoe = getRoeFromKoii(stakeToAdd);
    const meetsMinStake = stakeToAddInRoe >= minStake;
    if (!meetsMinStake) {
      setError(`Min stake: ${minStakeInKoii} KOII`);
    } else if (stakeToAdd > balance) {
      setError('Not enough balance');
    }
    setStakeAmount(stakeToAdd);
  };

  const confirmAddStake = () => addStake();

  const title =
    step === Step.Add
      ? 'Enter the amount you want to add to your stake.'
      : isStaking
      ? "Sit tight, we're adding your treasure to the pile."
      : 'Confirm your stake to run this task.';

  const buttonLabel = step === Step.Add ? 'Add Stake' : 'Run Task';
  const buttonAction =
    step === Step.Add ? handleClickAddStake : confirmAddStake;

  return (
    <Modal>
      <ModalContent className="w-[600px]">
        <ModalTopBar
          title="Add Stake"
          onClose={handleClose}
          onBackClick={() => setStep(Step.Add)}
          showBackButton={showBackButton}
        />

        <div className="flex flex-col items-center justify-center h-64 gap-5 py-8 text-finnieBlue-dark">
          <div>{title}</div>
          <div>
            {step === Step.Add ? (
              <KoiiInput onInputChange={handleInputChange} />
            ) : (
              <p className="text-4xl mt-1.5 text-center">{stakeAmount} KOII</p>
            )}
            <div className="h-12 -mt-2 -mb-10">
              {error && (
                <ErrorMessage error={error || (errorStaking as Error)} />
              )}
            </div>
          </div>
          <div className="py-2 text-xs text-finnieTeal-700">{`${balance} KOII available in your balance`}</div>
          <Button
            label={buttonLabel}
            onClick={buttonAction}
            className="py-4 text-white"
            loading={isStaking}
            disabled={!!error || !stakeAmount}
          />
        </div>
      </ModalContent>
    </Modal>
  );
});
