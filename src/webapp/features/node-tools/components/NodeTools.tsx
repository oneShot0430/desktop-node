import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useMemo, useState } from 'react';

import { pairTaskVariable } from 'webapp/services';

import { getPairedTaskVariablesForTask } from '../helpers';
import { useTaskVariablesNames, useStoredPairedTaskVariables } from '../hooks';

import { NodeTool } from './NodeTool';

type PropsType = {
  taskPubKey: string;
};

export const NodeTools = ({ taskPubKey }: PropsType) => {
  const { taskVariablesNamesQuery } = useTaskVariablesNames({ taskPubKey });
  const { storedPairedTaskVariablesQuery } = useStoredPairedTaskVariables();
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>(
    {}
  );

  const handleToolPick = (tool: string, desktopVariableId: string) => {
    setSelectedTools({ ...selectedTools, [tool]: desktopVariableId });
  };

  const confirmTaskVariables = async () => {
    // TODO: write it as a mutation
    const promises = Object.entries(selectedTools).map(
      ([tool, desktopVariableId]) => {
        return pairTaskVariable({
          taskAccountPubKey: taskPubKey,
          variableInTaskName: tool,
          desktopVariableId,
        });
      }
    );

    try {
      await Promise.all(promises);
      alert('All variables are paired successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: taskVariablesNames,
    isLoading: isLoadingTaskVariablesNames,
    // isError,
  } = taskVariablesNamesQuery;

  const { data: pairedVariables, isLoading: isLoadingPairedVariables } =
    storedPairedTaskVariablesQuery;

  const pairedVariablesForTask = useMemo(
    () => getPairedTaskVariablesForTask(taskPubKey, pairedVariables),
    [pairedVariables, taskPubKey]
  );

  console.log('@@@paired', pairedVariablesForTask);

  // TODO: remove this slice later
  const variableNames = taskVariablesNames && taskVariablesNames.slice(0, 3);

  return (
    <div className="w-full pb-4 pr-4">
      {isLoadingTaskVariablesNames && <div>Loading...</div>}
      {!isLoadingTaskVariablesNames && (
        <>
          {variableNames.map((tool) => (
            <NodeTool
              onSecretSelected={handleToolPick}
              tool={tool}
              key={tool}
              // TODO: remove stub link later
              getSecretLink="https://google.com"
              defaultVariableId={pairedVariablesForTask[tool]}
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
