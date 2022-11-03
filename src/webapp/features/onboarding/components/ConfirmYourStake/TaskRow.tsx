import React from 'react';
import { useQuery } from 'react-query';

import CodeIconSvg from 'assets/svgs/code-icon.svg';
import EditIconSvg from 'assets/svgs/edit-icon.svg';
import { Button } from 'webapp/components';
import { useTaskDetailsModal } from 'webapp/components/MyNodeTable/hooks/useTaskDetailsModal';
import { getMainAccountPublicKey, QueryKeys } from 'webapp/services';
import { TaskWithStake } from 'webapp/types';

interface PropsType {
  task: TaskWithStake;
}

export const TaskRow = ({ task }: PropsType) => {
  const { publicKey, taskName, stake } = task;

  const { data: mainAccountPubKey } = useQuery(QueryKeys.MainAccount, () =>
    getMainAccountPublicKey()
  );

  const { showModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey,
  });

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
            onClick={() => console.log('implement me')}
            icon={<EditIconSvg />}
            className="rounded-full w-6 h-6 bg-finnieTeal-100"
          />
          <div>{stake} KOII</div>
        </div>
      </div>
    </div>
  );
};
