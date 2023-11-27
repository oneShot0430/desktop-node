import { Icon } from '@_koii/koii-styleguide';
import React, { forwardRef } from 'react';

import DotsSvg from 'assets/svgs/options.svg';
import { Button } from 'renderer/components/ui';
import { Task } from 'renderer/types';

import { OptionsDropdown } from './OptionsDropdown';

type PropsType = {
  task: Task;
  optionsButtonClasses: string;
  shouldDisplayActions: boolean;
  optionsDropdownIsInverted: boolean;
  canUnstake: boolean;
  handleToggleOptionsDropdown: () => void;
  showAddStakeModal: () => void;
  showUnstakeModal: () => void;
  openTaskLogs: () => void;
  handleToggleTask: () => void;
  handleTaskArchive: (isArchiving: boolean) => void;
};

export const Options = forwardRef<HTMLDivElement, PropsType>(
  (
    {
      task,
      optionsDropdownIsInverted,
      handleToggleOptionsDropdown,
      optionsButtonClasses,
      shouldDisplayActions,
      showAddStakeModal,
      showUnstakeModal,
      openTaskLogs,
      handleToggleTask,
      handleTaskArchive,
      canUnstake,
    },
    ref
  ) => {
    return (
      <div ref={ref} className="relative flex flex-row items-center gap-4">
        <Button
          onClick={handleToggleOptionsDropdown}
          onlyIcon
          icon={<Icon source={DotsSvg} className="w-6 h-6 text-white" />}
          className={optionsButtonClasses}
        />
        {shouldDisplayActions && (
          <OptionsDropdown
            task={task}
            isInverted={optionsDropdownIsInverted}
            canUnstake={canUnstake}
            addStake={showAddStakeModal}
            unstake={showUnstakeModal}
            openLogs={openTaskLogs}
            runOrStopTask={handleToggleTask}
            onTaskArchive={handleTaskArchive}
          />
        )}
      </div>
    );
  }
);

Options.displayName = 'Options';
