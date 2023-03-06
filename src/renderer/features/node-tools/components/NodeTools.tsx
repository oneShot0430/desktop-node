import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useMutation } from 'react-query';

import { RequirementTag } from 'models/task';
import {
  ErrorMessage,
  LoadingSpinner,
  LoadingSpinnerSize,
} from 'renderer/components/ui';
import { pairTaskVariable } from 'renderer/services';

import { getPairedTaskVariablesForTask } from '../helpers';
import { useAllStoredPairedTaskVariables } from '../hooks';

import { NodeTool } from './NodeTool';

type PropsType = {
  taskPubKey: string;
  onToolsValidation?: (isValid: boolean) => void;
  tools?: RequirementTag[];
};

export function NodeTools({ taskPubKey, onToolsValidation, tools }: PropsType) {
  const [isAllVariablesPaired, setIsAllVariablesPaired] = useState(false);

  const {
    storedPairedTaskVariablesQuery: {
      data: pairedVariables,
      isLoading: isLoadingPairedVariables,
      error: pairedVariablesError,
    },
  } = useAllStoredPairedTaskVariables({
    enabled: !!taskPubKey,
  });

  const [selectedTools, setSelectedTools] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    /**
     * @dev validate if all variables are paired
     */
    if (tools) {
      const isAllVariablesPaired = tools?.every(
        ({ value }) => !!selectedTools[value as string]
      );

      setIsAllVariablesPaired(isAllVariablesPaired);
      onToolsValidation?.(isAllVariablesPaired);
    }
  }, [onToolsValidation, selectedTools, tools]);

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
  });

  const pairedVariablesForTask = useMemo(
    () => getPairedTaskVariablesForTask(taskPubKey, pairedVariables),
    [pairedVariables, taskPubKey]
  );

  const hasError = pairedVariablesError || isPairingTasksVariablesError;
  const isLoading = isLoadingPairedVariables;

  if (hasError) {
    return (
      <>
        {pairedVariablesError &&
          (pairedVariablesError || (
            <ErrorMessage error={pairedVariablesError as string} />
          ))}
        {isPairingTasksVariablesError && (
          <ErrorMessage error={isPairingTasksVariablesError as string} />
        )}
      </>
    );
  }

  return (
    <div className="w-full pb-4 pr-4">
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-40 gap-4">
          <LoadingSpinner size={LoadingSpinnerSize.Large} />
          <div>Loading Node Tools</div>
        </div>
      )}
      {!isLoading && (
        <>
          {tools?.map(({ value, description }, index) => (
            <NodeTool
              onSecretSelected={handleToolPick}
              onInit={handleInit}
              tool={value as string}
              key={index}
              defaultVariableId={pairedVariablesForTask[value as string]}
              description={description}
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
}
