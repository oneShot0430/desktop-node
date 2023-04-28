import { ChangeEventHandler, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { TaskVariableData, TaskVariableDataWithId } from 'models/api';
import {
  getStoredTaskVariables,
  storeTaskVariable as storeTaskVariableService,
  editTaskVariable as editTaskVariableService,
  QueryKeys,
} from 'renderer/services';

interface Params {
  onSuccess?: () => void;
  taskVariable?: TaskVariableDataWithId;
}

export const useTaskVariable = ({ onSuccess, taskVariable }: Params = {}) => {
  const [label, setLabel] = useState<string>(taskVariable?.label || '');
  const [value, setValue] = useState<string>(taskVariable?.value || '');
  const [labelError, setLabelError] = useState<string>('');

  const queryClient = useQueryClient();

  const { data: storedTaskVariables = {} } = useQuery(
    QueryKeys.TaskVariables,
    getStoredTaskVariables
  );

  const resetFields = () => {
    setLabel('');
    setValue('');
    setLabelError('');
  };

  const handleSuccess = () => {
    resetFields();
    queryClient.invalidateQueries([QueryKeys.TaskVariables]);
    onSuccess?.();
  };

  const {
    mutate: storeTaskVariable,
    error: errorStoringTaskVariable,
    isLoading: storingTaskVariable,
  } = useMutation<void, Error, TaskVariableData>(storeTaskVariableService, {
    onSuccess: handleSuccess,
  });

  const { mutate: editTaskVariable, error: errorEditingTaskVariable } =
    useMutation<void, Error, TaskVariableDataWithId>(editTaskVariableService, {
      onSuccess: handleSuccess,
    });

  const handleAddTaskVariable = () => storeTaskVariable({ label, value });

  const handleEditTaskVariable = () =>
    editTaskVariable({ id: taskVariable?.id || '', label, value });

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: label },
  }) => {
    setLabelError('');
    setLabel(label);
    const storedTaskVariablesLabels = Object.values(storedTaskVariables).map(
      ({ label }) => label
    );
    const enteredLabelIsDuplicate = storedTaskVariablesLabels?.some(
      (storedLabel) =>
        storedLabel === label &&
        // if we're editing an existing variable instead of creating a new one (there's `taskVariable?.label`), we wanna ignore the current label for the validation
        storedLabel !== taskVariable?.label
    );
    if (enteredLabelIsDuplicate) {
      setLabelError('You already have a tool registered with that label');
    }
  };

  const handleToolKeyChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setValue(value);

  return {
    handleAddTaskVariable,
    handleEditTaskVariable,
    handleLabelChange,
    handleToolKeyChange,
    label,
    value,
    storingTaskVariable,
    storedTaskVariables,
    errorStoringTaskVariable,
    errorEditingTaskVariable,
    labelError,
  };
};
