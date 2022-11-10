import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { twMerge } from 'tailwind-merge';

import CheckmarkIconSvg from 'assets/svgs/checkmark-teal-icon.svg';
import CodeIconSvg from 'assets/svgs/code-icon.svg';
import EditIconSvg from 'assets/svgs/edit-icon.svg';
import { getKoiiFromRoe } from 'utils';
import { Button } from 'webapp/components';
import { useTaskDetailsModal } from 'webapp/components/MyNodeTable/hooks/useTaskDetailsModal';
import { getMainAccountPublicKey, QueryKeys } from 'webapp/services';
import { TaskWithStake } from 'webapp/types';

import { EditStakeInput } from '..';

interface PropsType {
  task: TaskWithStake;
  updateStake: (taskPublicKey: string, newStake: number) => void;
  setIsRunButtonDisabled: (isDisabled: boolean) => void;
}

export const TaskRow = ({
  task,
  updateStake,
  setIsRunButtonDisabled,
}: PropsType) => {
  const { publicKey, taskName, stake: originalStake, minStake } = task;

  const [stake, setStake] = useState<number>(originalStake);
  const [isEditingStake, setIsEditingStake] = useState<boolean>(false);

  const stakeInKoii = useMemo(() => getKoiiFromRoe(stake), [stake]);

  const meetsMinimumStake = useMemo(() => stake >= minStake, [stake, minStake]);

  const { data: mainAccountPubKey } = useQuery(QueryKeys.MainAccount, () =>
    getMainAccountPublicKey()
  );

  const { showModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey,
  });

  const handleEditInputChange = (newStake: number) => setStake(newStake);

  const stakeButtonClasses = twMerge(
    'rounded-full w-6 h-6',
    !isEditingStake && 'bg-finnieTeal-100'
  );

  const stakeButtonIcon = isEditingStake ? (
    <CheckmarkIconSvg width={38} height={38} />
  ) : (
    <EditIconSvg />
  );

  const disableEditStake = () => {
    if (meetsMinimumStake) {
      updateStake(task.publicKey, stake);
      setIsEditingStake(false);
      setIsRunButtonDisabled(false);
    } else {
      setIsRunButtonDisabled(true);
    }
  };

  const enableEditStake = () => setIsEditingStake(true);

  const handleStakeButtonClick = isEditingStake
    ? disableEditStake
    : enableEditStake;

  return (
    <div
      className="flex flex-row w-full text-md text-finnieEmerald-light px-12"
      key={publicKey}
    >
      <div className="w-[70%]">
        <div className="flex flex-row items-center gap-2">
          <CodeIconSvg className="cursor-pointer" onClick={showModal} />
          <span>{taskName}</span>
        </div>
      </div>
      <div className="w-[30%]">
        <div className="flex flex-row gap-2">
          <Button
            onClick={handleStakeButtonClick}
            icon={stakeButtonIcon}
            className={stakeButtonClasses}
          />

          {isEditingStake ? (
            <EditStakeInput
              stake={stake}
              meetsMinimumStake={meetsMinimumStake}
              minStake={minStake}
              onChange={handleEditInputChange}
            />
          ) : (
            <div>{stakeInKoii} KOII</div>
          )}
        </div>
      </div>
    </div>
  );
};
