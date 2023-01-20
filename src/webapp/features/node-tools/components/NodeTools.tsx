import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useEffect, useMemo, useState } from 'react';

import { ErrorMessage } from 'webapp/components';
import { pairTaskVariable } from 'webapp/services';

import { getPairedTaskVariablesForTask } from '../helpers';
import { useTaskVariablesNames, useStoredPairedTaskVariables } from '../hooks';

import { NodeTool } from './NodeTool';

type PropsType = {
  taskPubKey: string;
  onNodeToolsValidation?: (isValid: boolean) => void;
};

export const NodeTools = ({ taskPubKey, onNodeToolsValidation }: PropsType) => {
  const [isAllVariablesPaired, setIsAllVariablesPaired] = useState(false);
  const {
    taskVariablesNamesQuery: {
      data: taskVariablesNames,
      isLoading: isLoadingTaskVariablesNames,
      error: taskVariablesNamesError,
    },
  } = useTaskVariablesNames({ taskPubKey });
  const {
    storedPairedTaskVariablesQuery: {
      data: pairedVariables,
      isLoading: isLoadingPairedVariables,
      error: pairedVariablesError,
    },
  } = useStoredPairedTaskVariables({
    enabled: !!taskPubKey && !isLoadingTaskVariablesNames,
  });
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    /***
     * @dev validate if all variables are paired
     */
    if (taskVariablesNames) {
      const isAllVariablesPaired = taskVariablesNames.every(
        (taskVariableName) => !!selectedTools[taskVariableName]
      );

      setIsAllVariablesPaired(isAllVariablesPaired);
      onNodeToolsValidation?.(isAllVariablesPaired);
    }
  }, [selectedTools, taskVariablesNames]);

  const handleToolPick = (tool: string, desktopVariableId: string) => {
    setSelectedTools({ ...selectedTools, [tool]: desktopVariableId });
  };

  const handleInit = (tool: string, desktopVariableId: string) => {
    /**
     * @dev
     * We need to set the default value for the tool which are not yet paired,
     * so we can validate the form and show the "Confirm" button
     */
    setSelectedTools((selectedTools) => ({
      ...selectedTools,
      [tool]: desktopVariableId,
    }));
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
      // TODO: show success message, handle pairing loading
      alert('All variables are paired successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const pairedVariablesForTask = useMemo(
    () => getPairedTaskVariablesForTask(taskPubKey, pairedVariables),
    [pairedVariables, taskPubKey]
  );

  // console.log('@@@paired', pairedVariablesForTask);

  const error = taskVariablesNamesError || pairedVariablesError;
  const loading = isLoadingTaskVariablesNames || isLoadingPairedVariables;

  if (error) {
    return <ErrorMessage error={error as string} />;
  }

  const variableNames = taskVariablesNames; // && taskVariablesNames.slice(0, 3);

  console.log('@@@selected', selectedTools);

  return (
    <div className="w-full pb-4 pr-4">
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          {variableNames.map((tool) => (
            <NodeTool
              onSecretSelected={handleToolPick}
              onInit={handleInit}
              tool={tool}
              key={tool}
              // TODO: create a metadata for each tool (?)
              getSecretLink={null}
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
              disabled={!isAllVariablesPaired}
            />
          </div>
        </>
      )}
    </div>
  );
};
