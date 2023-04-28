import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  CloseLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useState, useEffect, useMemo, RefObject } from 'react';
import toast, { Toaster } from 'react-hot-toast';
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
  onPairingSuccess: () => void;
  onOpenAddTaskVariableModal: (
    dropdownRef: RefObject<HTMLButtonElement>
  ) => void;
};

export function NodeTools({
  taskPubKey,
  onToolsValidation,
  tools,
  onPairingSuccess,
  onOpenAddTaskVariableModal,
}: PropsType) {
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
    setSelectedTools((selected) => ({
      ...selected,
      [tool]: desktopVariableId,
    }));
  };

  const confirmTaskVariables = async () => {
    const promises = Object.entries(selectedTools)
      .map(([tool, desktopVariableId]) => {
        if (!desktopVariableId) {
          return;
        }

        // eslint-disable-next-line consistent-return
        return pairTaskVariable({
          taskAccountPubKey: taskPubKey,
          variableInTaskName: tool,
          desktopVariableId,
        });
      })
      .filter(Boolean);

    await Promise.all(promises);
  };

  const onSuccess = () => {
    onPairingSuccess();

    toast.success('Task settings successfully paired', {
      icon: <CheckSuccessLine className="h-5 w-5" />,
      style: {
        backgroundColor: '#BEF0ED',
        paddingRight: 0,
      },
    });
  };

  const onError = () => {
    toast.error('Task settings pairing failed. Try Again', {
      icon: <CloseLine className="h-5 w-5" />,
      style: {
        backgroundColor: '#FFA6A6',
        paddingRight: 0,
      },
    });
  };

  const { mutate: pairTaskVariables, isLoading: isPairingTasksVariables } =
    useMutation(confirmTaskVariables, {
      onSuccess,
      onError,
    });

  const pairedVariablesForTask = useMemo(
    () => getPairedTaskVariablesForTask(taskPubKey, pairedVariables),
    [pairedVariables, taskPubKey]
  );

  const isLoading = isLoadingPairedVariables;

  if (pairedVariablesError) {
    return <ErrorMessage error={pairedVariablesError as string} />;
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
              onOpenAddTaskVariableModal={onOpenAddTaskVariableModal}
            />
          ))}
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
      <Toaster />
    </div>
  );
}
