import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useState } from 'react';

import { pairTaskVariable } from 'webapp/services';

import { useTaskVariablesNames } from '../hooks';

import { NodeTool } from './NodeTool';

type PropsType = {
  taskPubKey: string;
};

export const NodeTools = ({ taskPubKey }: PropsType) => {
  const { taskVariablesNamesQuery } = useTaskVariablesNames({ taskPubKey });
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>(
    {}
  );

  const handleToolPick = (tool: string, desktopVariableId: string) => {
    setSelectedTools({ ...selectedTools, [tool]: desktopVariableId });
  };

  const confirmTaskVariables = async () => {
    const promises = Object.entries(selectedTools).map(
      ([tool, desktopVariableId]) => {
        return pairTaskVariable({
          taskAccountPubKey: taskPubKey,
          variableInTaskName: tool,
          desktopVariableId,
        });
      }
    );

    console.log('@promises', promises);

    try {
      await Promise.all(promises);
      alert('All variables are paired successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: taskVariablesNames,
    isLoading,
    // isError,
  } = taskVariablesNamesQuery;

  // TODO: remove this slice later
  const variableNames = taskVariablesNames && taskVariablesNames.slice(0, 3);

  return (
    <div className="w-full pb-4 pr-4">
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          {variableNames.map((tool) => (
            <NodeTool
              onSecretSelected={handleToolPick}
              tool={tool}
              key={tool}
              getSecretLink="https://google.com"
            />
          ))}
          <div className="flex justify-end">
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.SM}
              label="Confirm All"
              iconLeft={<Icon source={CheckSuccessLine} />}
              onClick={confirmTaskVariables}
            />
          </div>
        </>
      )}
    </div>
  );
};
