import { AddLine, Icon } from '@_koii/koii-styleguide';
import React, { RefObject, useEffect, useMemo } from 'react';

import { Dropdown, DropdownItem } from 'renderer/components/ui';

import { useStoredTaskVariables } from '../hooks';

type PropsType = {
  tool: string;
  description?: string;
  defaultVariableId?: string;
  onOpenAddTaskVariableModal: (
    dropdownRef: RefObject<HTMLButtonElement>,
    tool: string
  ) => void;
  onSecretSelected?: (tool: string, desktopVariableId: string) => void;
  onInit?: (tool: string, desktopVariableId: string) => void;
};

export function NodeTool({
  tool,
  description,
  onSecretSelected,
  defaultVariableId,
  onInit,
  onOpenAddTaskVariableModal,
}: PropsType) {
  const dropdownRef = React.useRef<HTMLButtonElement>(null);
  const { storedTaskVariablesQuery } = useStoredTaskVariables();
  const { data: taskVariables, isLoading } = storedTaskVariablesQuery;

  const handleSecretSelected = (item: DropdownItem) => {
    onSecretSelected?.(tool, item.id);
  };

  useEffect(() => {
    onInit?.(tool, defaultVariableId as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropdownItems = useMemo(() => {
    if (!taskVariables) return [];

    const transformedItems = Object.entries(taskVariables).map(
      ([id, taskVariableItem]) => ({
        id,
        ...taskVariableItem,
      })
    );

    return transformedItems;
  }, [taskVariables]);

  const defaultValue = useMemo(() => {
    if (!defaultVariableId) return null;

    return dropdownItems.find(
      (taskVariable) => taskVariable.id === defaultVariableId
    );
  }, [defaultVariableId, dropdownItems]);

  if (isLoading) return null;

  return (
    <div className="relative flex justify-between w-full my-3">
      <div className="flex flex-col gap-1 max-w-[60%]">
        <div className="font-semibold break-all text-finnieTeal">{tool}</div>
        {description && <div className="text-xs">{description}</div>}
      </div>
      <div className="flex items-start gap-3 pt-[2px]">
        <Dropdown
          ref={dropdownRef}
          defaultValue={defaultValue}
          items={dropdownItems}
          customItem={
            <div className="hover:bg-purple-1 hovertext-finnieTeal-100">
              <button
                className="flex items-center justify-start gap-2 py-2 pl-3 cursor-pointer text-green-2 curs w-fit"
                onClick={() => onOpenAddTaskVariableModal(dropdownRef, tool)}
              >
                <Icon source={AddLine} size={18} />
                <span>Add New</span>
              </button>
            </div>
          }
          /**
           * @dev
           * We don't need to show the validation error here yet, because we don't have
           * the validation logic for the NodeTool component yet.
           */
          // validationError={undefined}
          onSelect={handleSecretSelected}
        />
      </div>
    </div>
  );
}
