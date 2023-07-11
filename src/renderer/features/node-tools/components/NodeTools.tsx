import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  CloseLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, {
  useState,
  useEffect,
  useMemo,
  RefObject,
  useCallback,
} from 'react';
import toast from 'react-hot-toast';
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
    dropdownRef: RefObject<HTMLButtonElement>,
    tool: string
  ) => void;
};

export function NodeTools({
  taskPubKey,
  onToolsValidation,
  tools,
  onPairingSuccess,
  onOpenAddTaskVariableModal,
}: PropsType) {
  const {
    storedPairedTaskVariablesQuery: {
      data: pairedVariables,
      isLoading: isLoadingPairedVariables,
      error: pairedVariablesError,
    },
  } = useAllStoredPairedTaskVariables({
    enabled: !!taskPubKey,
  });

  const [areAllVariablesSelected, setAreAllVariablesSelected] = useState(false);
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>(
    {}
  );

  const checkifAllVariablesSelected = useCallback(
    () => !!tools?.every(({ value }) => !!selectedTools[value as string]),
    [tools, selectedTools]
  );

  useEffect(() => {
    const areAllVariablesSelected = checkifAllVariablesSelected();
    setAreAllVariablesSelected(areAllVariablesSelected);
  }, [setAreAllVariablesSelected, checkifAllVariablesSelected]);

  const handleToolPick = (tool: string, desktopVariableId: string) => {
    setSelectedTools({ ...selectedTools, [tool]: desktopVariableId });
  };

  const handleInit = (tool: string, desktopVariableId: string) => {
    /**
     * @dev
     * We need to set the default value for the tool which are not yet selected,
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

    // As at this specific stage we have just successfully paired, if all variables are selected means they are paired too
    const areAllVariablesPaired = checkifAllVariablesSelected();
    onToolsValidation?.(areAllVariablesPaired);

    toast.success('Task settings successfully paired', {
      duration: 4500,
      icon: <CheckSuccessLine className="w-5 h-5" />,
      style: {
        backgroundColor: '#BEF0ED',
        paddingRight: 0,
      },
    });
  };

  const onError = () => {
    toast.error('Task settings pairing failed. Try Again', {
      duration: 4500,
      icon: <CloseLine className="w-5 h-5" />,
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
              // TODO: fixme: fix dropdown with React Portal
              // dropDownPlacementBottom={
              //   !(index > 0 && index === tools.length - 1)
              // }
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
              disabled={!areAllVariablesSelected || isPairingTasksVariables}
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
