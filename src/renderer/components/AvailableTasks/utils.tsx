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
  toast.error(`Task ${taskName} running failed. Please try again!`);
};

type GetTooltipContentParamsType = {
  isRunning?: boolean;
  isTaskDelisted?: boolean;
  myStakeInKoii?: number;
  minStake?: number;
  isPrivate?: boolean;
};

export function getTooltipContent({
  isRunning,
  isTaskDelisted,
  myStakeInKoii = 0,
  minStake = 0,
  isPrivate,
}: GetTooltipContentParamsType) {
  if (!isPrivate) {
    if (!isRunning && isTaskDelisted) {
      return "This task has been delisted, but don't worry! Your tokens are safe and will be ready to unstake after 3 rounds.";
    }
    if (isTaskDelisted) {
      return "This task has been delisted, but don't worry! Your tokens are safe. Pause the task and the tokens will be ready to unstake after 3 rounds.";
    }
  }
  if (myStakeInKoii > 0) {
    return isRunning ? 'Stop task' : 'Start task';
  }
  return `You need to stake at least ${minStake} KOII on this task to run it.`;
}

export function ErrorList({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  if (errors.length === 1) {
    return <p>Make sure you {errors[0]}.</p>;
  }

  const errorListItems = errors.map((error, index) => (
    <li key={index}>• {error}</li>
  ));

  return (
    <div>
      Make sure you:
      <br />
      <ul>{errorListItems}</ul>
    </div>
  );
}
