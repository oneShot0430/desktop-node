import { Icon } from '@_koii/koii-styleguide';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { twMerge } from 'tailwind-merge';

import Clock from 'assets/svgs/clock.svg';
import { Tooltip } from 'renderer/components/ui';
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

  const isOn = !!isChecked;

  const switchContainerClasses = twMerge(
    'flex gap-2 rounded-lg w-fit items-center'
  );

  const iconClasses = twMerge('w-5 h-5');

  return (
    <Tooltip
      tooltipContent="This task will run when the Automate feature is turned on."
      placement="bottom-left"
    >
      <div className={switchContainerClasses}>
        <Icon
          source={Clock}
          className={iconClasses}
          color={isOn ? '#9BE7C4' : '#FFF'}
        />
        <Switch
          id={`switch-${taskPublicKey}`}
          isChecked={isOn}
          disabled={mutationAdd.isLoading || mutationRemove.isLoading}
          onSwitch={handleSwitch}
        />
      </div>
    </Tooltip>
  );
}
