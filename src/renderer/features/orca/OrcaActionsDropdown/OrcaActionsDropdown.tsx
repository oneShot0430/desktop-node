import { Icon, CheckSuccessFill } from '@_koii/koii-styleguide';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAtom } from 'jotai';
import React, { forwardRef, useMemo, useState } from 'react';

import {
  selectedTasksAtom,
  tasksMetadataByIdAtom,
  usePrivateTasks,
} from 'renderer/features/tasks';
import { isOrcaTask } from 'renderer/features/tasks/utils';

import { useOrcaPodman, useOrcaTasksActions } from '../hooks';
import { OrcaButton } from '../OrcaButton';

import { OrcaActionButton } from './OrcaActionButton';

export const DROPDOWN_MENU_ID = 'orca_dropdown_menu';
export const DEFAULT_PLACEHOLDER_TEXT = 'Select item';

export type DropdownProps = { className?: string };

export const OrcaActionsDropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  ({ className }) => {
    const [selectedTasks] = useAtom(selectedTasksAtom);
    const [selectedTasksMetadataByCid] = useAtom(tasksMetadataByIdAtom);
    const { privateTasksQuery } = usePrivateTasks();

    const orcaTasks = useMemo(
      () =>
        selectedTasks.filter(({ metadataCID }) => {
          const metadata = selectedTasksMetadataByCid[metadataCID];
          return isOrcaTask(metadata);
        }),
      [selectedTasks, selectedTasksMetadataByCid]
    );

    const handleMenuOpenChange = (open: boolean) => {
      setIsMenuOpen(open);
    };

    const { startOrcaTasks, stopOrcaTasks, isLoading } = useOrcaTasksActions(
      orcaTasks,
      privateTasksQuery.data
    );

    const anyOrcaTaskRunning = orcaTasks.some(({ isRunning }) => !!isRunning);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { loadingOrcaPodman, data: orcaStatus } = useOrcaPodman();
    console.log({ loadingOrcaPodman, orcaStatus });

    const getOrcaStatusDisplay = () => {
      if (loadingOrcaPodman) {
        return (
          <span className="font-semibold uppercase bg-finnieOrange">
            Orca is loading
          </span>
        );
      }

      if (orcaStatus?.isOrcaVMRunning) {
        return (
          <span className="flex items-center gap-2 font-semibold uppercase text-green-2">
            <Icon source={CheckSuccessFill} />
            <span>Orca is running</span>
          </span>
        );
      }

      if (!orcaStatus?.isPodmanExists) {
        return (
          <span className="text-sm text-finnieTeal-100">
            <span>
              Please install Orca by following the instruction under Settings
              then Task Extensions
            </span>
          </span>
        );
      }
      return (
        <span className="font-semibold uppercase text-finnieGray-100">
          Orca is paused
        </span>
      );
    };

    const getOrcaStatus = () => {
      if (loadingOrcaPodman) {
        return 'loading';
      }

      if (orcaStatus?.isOrcaVMRunning) {
        return 'running';
      }

      return 'paused';
    };

    return (
      <div className={className} data-testid="koii_dropdown_test_id">
        <DropdownMenu.Root onOpenChange={handleMenuOpenChange}>
          <DropdownMenu.Trigger asChild>
            <OrcaButton isActive={isMenuOpen} status={getOrcaStatus()} />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="text-base text-white rounded-md p-[5px] bg-purple-5 focus:outline-none z-50 w-[320px] mr-8 py-4 px-6"
              sideOffset={5}
              id={DROPDOWN_MENU_ID}
            >
              <DropdownMenu.Item
                tabIndex={-1}
                className="py-2 focus:outline-none"
              >
                {getOrcaStatusDisplay()}
              </DropdownMenu.Item>
              <DropdownMenu.Item className="py-2">
                <OrcaActionButton
                  anyOrcaTaskRunning={anyOrcaTaskRunning}
                  disabled={!orcaTasks || orcaTasks.length === 0 || isLoading}
                  startOrcaTasks={startOrcaTasks}
                  stopOrcaTasks={stopOrcaTasks}
                  isLoading={isLoading}
                />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    );
  }
);

OrcaActionsDropdown.displayName = 'OrcaActionsDropdown';
