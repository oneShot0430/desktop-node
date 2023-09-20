import { Icon } from '@_koii/koii-styleguide';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import Clock from 'assets/svgs/clock.svg';
import { Switch } from 'renderer/components/ui/Switch';
import {
  removeTaskFromScheduler,
  addTaskToScheduler,
  QueryKeys,
} from 'renderer/services';

type PropsType = {
  taskPublicKey: string;
  defaultValue?: boolean;
};

export function TurnSchedulerOnOffOnTask({
  taskPublicKey,
  defaultValue,
}: PropsType) {
  const queryClient = useQueryClient();

  const [isChecked, setIsChecked] = useState(defaultValue);

  const mutationAdd = useMutation(() => addTaskToScheduler(taskPublicKey), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.SchedulerTasks);
      setIsChecked(true);
    },
  });

  const mutationRemove = useMutation(
    () => removeTaskFromScheduler(taskPublicKey),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.SchedulerTasks);
        setIsChecked(false);
      },
    }
  );

  const handleSwitch = () => {
    if (isChecked) {
      mutationRemove.mutate();
    } else {
      mutationAdd.mutate();
    }
  };

  return (
    <div className="flex p-2 bg-[#949494] gap-2 rounded-lg w-fit h-10">
      <Switch
        id={`switch-${taskPublicKey}`}
        isChecked={!!isChecked}
        disabled={mutationAdd.isLoading || mutationRemove.isLoading}
        onSwitch={handleSwitch}
      />
      <Icon source={Clock} />
    </div>
  );
}
