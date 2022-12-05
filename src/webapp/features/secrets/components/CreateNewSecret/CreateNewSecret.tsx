import React, { useCallback, useMemo, useState } from 'react';

import BackIcon from 'svgs/back-icon-white.svg';
import { Button } from 'webapp/components';
import { Task } from 'webapp/types/task';

import { SecretsDetails } from './SecretsDetails';
import { TaskSecretsRow } from './TaskSecretsRow';

type PropsType = {
  onBackButtonClick: () => void;
};

export const CreateNewSecret = ({ onBackButtonClick }: PropsType) => {
  const [taskSecretsDetails, showTaskSecretsDetails] = useState<Task>(null);
  // const { data } = useMyTasks({
  //   pageSize: 10,
  // });

  const onGetSecretClick = useCallback((task: Task) => {
    showTaskSecretsDetails(task);
  }, []);

  const rows: Task[] = useMemo(() => (data?.pages || []).flat(), [data]);

  return (
    <div className="flex flex-col h-full text-white">
      <div className="p-2 border-b-2 border-gray-500">
        <div className="flex items-center gap-4">
          <Button
            onlyIcon
            icon={<BackIcon className="cursor-pointer" />}
            onClick={onBackButtonClick}
          />
          <div className="font-semibold">Create a New Secret</div>
        </div>
      </div>

      <div className="pl-2 my-4">
        {taskSecretsDetails
          ? 'Click a key and follow the instructions to get a new secret.'
          : 'Follow the instructions to get a new secret. Then you’ll be able to run this task.'}
      </div>

      <div className="flex-grow">
        {taskSecretsDetails ? (
          <SecretsDetails task={taskSecretsDetails} />
        ) : (
          rows.map((task) => (
            <TaskSecretsRow
              task={task}
              key={task.publicKey}
              onGetSecretClick={onGetSecretClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
