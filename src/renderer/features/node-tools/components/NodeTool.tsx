import React, { useEffect, useMemo } from 'react';

import { OMITTED_VARIABLE_IDENTIFIER } from 'models';
import { Dropdown, DropdownItem } from 'renderer/components/ui';

import { useStoredTaskVariables } from '../hooks';

type PropsType = {
  tool: string;
  description?: string;
  defaultVariableId?: string;
  onSecretSelected?: (tool: string, desktopVariableId: string) => void;
  onInit?: (tool: string, desktopVariableId: string) => void;
};

export function NodeTool({
  tool,
  description,
  onSecretSelected,
  defaultVariableId,
  onInit,
}: PropsType) {
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

    return [
      ...transformedItems,
      {
        id: OMITTED_VARIABLE_IDENTIFIER,
        label: 'Skip this setting',
        value: OMITTED_VARIABLE_IDENTIFIER,
      },
    ];
  }, [taskVariables]);

  const defaultValue = useMemo(() => {
    if (!defaultVariableId) return null;

    return dropdownItems.find(
      (taskVariable) => taskVariable.id === defaultVariableId
    );
  }, [defaultVariableId, dropdownItems]);

  if (isLoading) return null;

  return (
    <div className="flex justify-between w-full my-3">
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-finnieTeal">{tool}</div>
        {description && <div className="text-xs">{description}</div>}
      </div>
      <div className="flex items-start gap-3 pt-[2px]">
        <Dropdown
          defaultValue={defaultValue}
          items={dropdownItems}
          /**
           * @dev
           * We don't need to show the validation error here yet, because we don't have
           * the validation logic for the NodeTool component yet.
           */
          validationError={undefined}
          onSelect={handleSecretSelected}
        />
      </div>
    </div>
  );
}
