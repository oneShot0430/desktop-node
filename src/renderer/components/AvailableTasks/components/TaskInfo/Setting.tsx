import {
  AddLine,
  CheckSuccessLine,
  CloseLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { RefObject, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

import { Dropdown, DropdownItem } from 'renderer/components/ui';
import { useStoredTaskVariables } from 'renderer/features/node-tools';
import {
  QueryKeys,
  pairTaskVariable,
  startTask,
  stopTask,
} from 'renderer/services';

interface Props {
  publicKey: string;
  name: string;
  label: string;
  isRunning?: boolean;
  onOpenAddTaskVariableModal?: (
    dropdownRef: RefObject<HTMLButtonElement>,
    settingName: string
  ) => void;
  isEditDisabled?: boolean;
}

export function Setting({
  publicKey,
  name,
  label,
  isRunning,
  onOpenAddTaskVariableModal,
  isEditDisabled,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSettingId, setNewSettingId] = useState<DropdownItem['id']>('');

  const dropdownRef = React.useRef<HTMLButtonElement>(null);

  const toggleEditMode = () => setIsEditing(!isEditing);
  const handleClickCancel = () => {
    setNewSettingId('');
    toggleEditMode();
  };
  const handleSelect = (item: DropdownItem) => {
    setNewSettingId(item.id);
  };

  const {
    storedTaskVariablesQuery: { data: taskSettings, isLoading },
  } = useStoredTaskVariables();

  const queryClient = useQueryClient();

  const { mutate: pairTaskSetting, isLoading: isPairing } = useMutation(
    () =>
      pairTaskVariable({
        taskAccountPubKey: publicKey,
        variableInTaskName: name,
        desktopVariableId: newSettingId,
      }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([
          QueryKeys.StoredTaskPairedTaskVariables,
          publicKey,
        ]);
        toast.success('Task setting successfully paired.', {
          duration: 4500,
          icon: <CheckSuccessLine className="h-5 w-5" />,
          style: {
            backgroundColor: '#BEF0ED',
            paddingRight: 0,
          },
        });
        handleClickCancel();
        if (isRunning) {
          try {
            await stopTask(publicKey);
            await startTask(publicKey);
          } catch (error) {
            console.warn(error);
            toast.error(
              'Restarting the task failed after pairing. Try stopping and running it manually to use the new setting.',
              {
                duration: 10000,
                icon: <CloseLine className="h-5 w-5" />,
                style: {
                  backgroundColor: '#FFA6A6',
                  maxWidth: '100%',
                  paddingRight: 0,
                },
              }
            );
          } finally {
            queryClient.invalidateQueries([QueryKeys.taskList]);
          }
        }
      },
      onError: () => {
        toast.error('Task setting pairing failed. Try Again.', {
          duration: 4500,
          icon: <CloseLine className="h-5 w-5" />,
          style: {
            backgroundColor: '#FFA6A6',
            paddingRight: 0,
          },
        });
      },
    }
  );

  const dropdownItems = !taskSettings
    ? []
    : Object.entries(taskSettings).map(([id, taskVariableItem]) => ({
        id,
        ...taskVariableItem,
      }));

  const isRightButtonDisabled = (isEditing && !newSettingId) || isPairing;
  const rightButtonClasses = `p-2 mr-2 text-sm rounded-md bg-finnieBlue-light-tertiary w-12 ${
    isRightButtonDisabled && 'opacity-50'
  }`;
  const handleRightButtonClick = isEditing
    ? () => pairTaskSetting()
    : toggleEditMode;

  if (isLoading) return null;

  return (
    <div className="flex justify-between w-full my-3 items-center">
      <div className="font-semibold text-xs">{name}</div>
      <div className="flex">
        {isEditing ? (
          <>
            <button
              onClick={handleClickCancel}
              className="p-2 mr-4 text-sm rounded-md bg-finnieBlue-light-tertiary"
            >
              Cancel
            </button>
            <Dropdown
              ref={dropdownRef}
              className="-mb-4 !w-80 mr-4"
              items={dropdownItems}
              onSelect={handleSelect}
              customItem={
                <div className="hover:bg-purple-1 hovertext-finnieTeal-100">
                  <button
                    className="flex justify-start pl-3 py-2 items-center text-green-2 gap-2 curs w-fit cursor-pointer"
                    onClick={() =>
                      onOpenAddTaskVariableModal?.(dropdownRef, name)
                    }
                  >
                    <Icon source={AddLine} size={18} />
                    <span>Add New</span>
                  </button>
                </div>
              }
            />
          </>
        ) : (
          <div className="px-6 py-2 mr-4 text-sm rounded-md bg-finnieBlue-light-tertiary w-80">
            {label}
          </div>
        )}
        {!isEditDisabled && (
          <button
            onClick={handleRightButtonClick}
            className={rightButtonClasses}
            disabled={isRightButtonDisabled}
          >
            {isEditing ? 'Pair' : 'Edit'}
          </button>
        )}
      </div>
    </div>
  );
}
