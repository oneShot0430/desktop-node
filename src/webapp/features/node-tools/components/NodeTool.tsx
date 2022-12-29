import React, { useMemo } from 'react';

import { Dropdown, DropdownItem } from 'webapp/components';

import { useStoredTaskVariables } from '../hooks';

type PropsType = {
  tool: string;
  getSecretLink?: string;
  onSecretSelected?: (item: DropdownItem) => void;
};

export const NodeTool = ({
  tool,
  getSecretLink,
  onSecretSelected,
}: PropsType) => {
  // eslint-disable-next-line import/no-named-as-default-member
  const { storedTaskVariablesQuery } = useStoredTaskVariables();
  const { data: taskVariables, isLoading } = storedTaskVariablesQuery;

  const handleSecretSelected = (item: DropdownItem) => {
    onSecretSelected?.(item);
  };

  const transformedTaskVariables = useMemo(() => {
    if (!taskVariables) return [];

    return Object.entries(taskVariables).map(([id, taskVariableItem]) => ({
      id,
      ...taskVariableItem,
    }));
  }, [taskVariables]);

  if (isLoading) return <div>Loading...</div>;

  console.log('###taskVariables', transformedTaskVariables);

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
          items={transformedTaskVariables}
          validationError="wrong tool"
          onSelect={handleSecretSelected}
        />
      </div>
    </div>
  );
};
