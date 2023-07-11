import { CloseLine } from '@_koii/koii-styleguide';
import React from 'react';
import toast from 'react-hot-toast';

import { getKoiiFromRoe } from 'utils';

type GetErrorMessageParams = {
  hasEnoughKoii: boolean;
  minStake: number | undefined;
  isTaskRunning: boolean;
  hasMinimumStake: boolean;
  isTaskToolsValid: boolean;
};

export const getErrorMessage = ({
  hasEnoughKoii,
  minStake,
  isTaskRunning,
  hasMinimumStake,
  isTaskToolsValid,
}: GetErrorMessageParams) => {
  if (isTaskRunning) return [];

  const conditions = [
    { condition: hasEnoughKoii, errorMessage: 'have enough KOII to stake' },
    {
      condition: hasMinimumStake,
      errorMessage: `stake at least ${getKoiiFromRoe(
        minStake || 0
      )} KOII on this Task`,
    },
    {
      condition: isTaskToolsValid,
      errorMessage: 'configure the Task settings',
    },
  ];

  const errors = conditions
    .filter(({ condition }) => !condition)
    .map(({ errorMessage }) => errorMessage);

  return errors;
};

export const showTaskRunErrorToast = (taskName: string | undefined) => {
  if (taskName === '') return;
  toast.error(`Task ${taskName} running failed. Please try again!`, {
    duration: 1500,
    icon: <CloseLine className="w-5 h-5" />,
    style: {
      backgroundColor: '#FFA6A6',
      paddingRight: 0,
    },
  });
};
