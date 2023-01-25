import React, { useEffect, useMemo } from 'react';

import { OMITTED_VARIABLE_IDENTIFIER } from 'models';
import { Dropdown, DropdownItem } from 'webapp/components';

import { useStoredTaskVariables } from '../hooks';

type PropsType = {
  tool: string;
  getSecretLink?: string;
  defaultVariableId?: string;
  onSecretSelected?: (tool: string, desktopVariableId: string) => void;
  onInit?: (tool: string, desktopVariableId: string) => void;
};

export const NodeTool = ({
  tool,
  getSecretLink,
  onSecretSelected,
  defaultVariableId,
  onInit,
}: PropsType) => {
  // eslint-disable-next-line import/no-named-as-default-member
  const { storedTaskVariablesQuery } = useStoredTaskVariables();
  const { data: taskVariables, isLoading } = storedTaskVariablesQuery;

  const handleSecretSelected = (item: DropdownItem) => {
    onSecretSelected?.(tool, item.id);
  };

  useEffect(() => {
    onInit?.(tool, defaultVariableId);
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
    if (!defaultVariableId) return undefined;

    return dropdownItems.find(
      (taskVariable) => taskVariable.id === defaultVariableId
    );
  }, [defaultVariableId, dropdownItems]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex justify-between w-full">
      <div>
        <div className="mb-2 font-semibold text-finnieTeal">{tool}</div>
        {getSecretLink && (
          <div className="text-xs">
            Don’t have one yet?{' '}
            <a
              href={getSecretLink}
              className="font-normal underline cursor-pointer text-orange-2"
            >
              Click here to get it.
            </a>
          </div>
        )}
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
          validationError={null}
          onSelect={handleSecretSelected}
        />
      </div>
    </div>
  );
};
