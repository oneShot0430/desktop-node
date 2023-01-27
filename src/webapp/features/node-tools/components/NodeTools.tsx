import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';

import {
  ErrorMessage,
  LoadingSpinner,
  LoadingSpinnerSize,
} from 'webapp/components';
import { pairTaskVariable } from 'webapp/services';

import { getPairedTaskVariablesForTask } from '../helpers';
import {
  useTaskVariablesNames,
  useAllStoredPairedTaskVariables,
} from '../hooks';

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
  } = useAllStoredPairedTaskVariables({
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
  }, [onNodeToolsValidation, selectedTools, taskVariablesNames]);

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

  const confirmTaskVariables = useCallback(async () => {
    const promises = Object.entries(selectedTools)
      .map(([tool, desktopVariableId]) => {
        if (!desktopVariableId) {
          return;
        }

        return pairTaskVariable({
          taskAccountPubKey: taskPubKey,
          variableInTaskName: tool,
          desktopVariableId,
        });
      })
      .filter(Boolean);

    await Promise.all(promises);
  }, [selectedTools, taskPubKey]);

  const {
    mutate: pairTaskVariables,
    isLoading: isPairingTasksVariables,
    error: isPairingTasksVariablesError,
  } = useMutation(confirmTaskVariables, {
    onSuccess: () => {
      alert('Pairing Task Variables Success');
    },
    onError: (error) => {
      alert(error);
    },
  });

  const pairedVariablesForTask = useMemo(
    () => getPairedTaskVariablesForTask(taskPubKey, pairedVariables),
    [pairedVariables, taskPubKey]
  );

  const error = taskVariablesNamesError || pairedVariablesError;
  const loading = isLoadingTaskVariablesNames || isLoadingPairedVariables;

  if (error) {
    return <ErrorMessage error={error as string} />;
  }

  return (
    <div className="w-full pb-4 pr-4">
      {loading && (
        <div className="flex flex-col items-center justify-center h-40 gap-4">
          <LoadingSpinner size={LoadingSpinnerSize.Large} />
          <div>Loading Node Tools</div>
        </div>
      )}
      {!loading && (
        <>
          {taskVariablesNames.map((tool) => (
            <NodeTool
              onSecretSelected={handleToolPick}
              onInit={handleInit}
              tool={tool}
              key={tool}
              /**
               * @dev
               * Metadata for the tool is not available yet,
               * so we need to pass null for now
               */
              getSecretLink={null}
              defaultVariableId={pairedVariablesForTask[tool]}
            />
          ))}
          {isPairingTasksVariablesError && (
            <ErrorMessage
              error={isPairingTasksVariablesError as string}
              className="my-4"
            />
          )}
          <div className="flex justify-end">
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.SM}
              label={isPairingTasksVariables ? 'Pairing...' : 'Confirm All'}
              iconLeft={
                isPairingTasksVariables ? (
                  <LoadingSpinner />
                ) : (
                  <Icon source={CheckSuccessLine} />
                )
              }
              onClick={() => pairTaskVariables()}
              disabled={!isAllVariablesPaired || isPairingTasksVariables}
              /**
               * @todo implement loading state for style guide Button
               */
              // loading={isPairingTasksVariables}
            />
          </div>
        </>
      )}
    </div>
  );
};
