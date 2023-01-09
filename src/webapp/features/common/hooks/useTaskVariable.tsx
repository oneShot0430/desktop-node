import { ChangeEventHandler, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { TaskVariableData } from 'models';
import {
  getStoredTaskVariables,
  storeTaskVariable as storeTaskVariableService,
  QueryKeys,
} from 'webapp/services';

interface Params {
  onAddSuccess?: () => void;
}

export const useTaskVariable = ({ onAddSuccess }: Params = {}) => {
  const [label, setLabel] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [labelError, setLabelError] = useState<string>('');

  const queryClient = useQueryClient();

  const { data: storedTaskVariables = {} } = useQuery(
    QueryKeys.TaskVariables,
    getStoredTaskVariables
  );

  console.log('storedTaskVariables: ', storedTaskVariables);

  const resetFields = () => {
    setLabel('');
    setValue('');
    setLabelError('');
  };

  const { mutate: storeTaskVariable, error: errorStoringTaskVariable } =
    useMutation<void, Error, TaskVariableData>(storeTaskVariableService, {
      onSuccess: () => {
        resetFields();
        queryClient.invalidateQueries([QueryKeys.TaskVariables]);
        onAddSuccess?.();
      },
    });

  const handleAddTaskVariable = async () => {
    storeTaskVariable({ label, value });
  };

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: label },
  }) => {
    setLabelError('');
    setLabel(label);
    const storedTaskVariablesLabels = Object.values(storedTaskVariables).map(
      ({ label }) => label
    );
    const enteredLabelIsDuplicate = storedTaskVariablesLabels?.some(
      (storedLabel) => storedLabel === label
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
    handleLabelChange,
    handleToolKeyChange,
    label,
    value,
    labelError,
    errorStoringTaskVariable,
    storedTaskVariables,
  };
};
