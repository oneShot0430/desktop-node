import { DetailedError, ErrorType, ErrorContext } from 'models';

// Due to Electron automatically serializing any error thrown from the BE, we stringify our custom error object and parse it later to retrieve it (see `getErrorToDisplay`)
export const throwDetailedError = ({
  detailed,
  type,
  context,
}: DetailedError) => {
  throw new Error(
    JSON.stringify({
      detailed,
      type,
      context,
    })
  );
};

export const getErrorToDisplay = (error: Error | string) => {
  if (!error) return undefined;
  if (typeof error === 'string') return error;

  const isDetailedError = error.message.includes('"type":');

  if (isDetailedError) {
    const serializedError = error.message.substring(error.message.indexOf('{'));
    const parsedError: DetailedError = JSON.parse(serializedError);
    const mainMessage =
      errorTypeToMessage[parsedError.type] || parsedError.detailed;
    const contextSuffix = errorContextToSuffix[parsedError.context] || '';
    const errorMessage = `${mainMessage}${contextSuffix}.`;

    return errorMessage;
  } else {
    return error?.message;
  }
};

export const errorTypeToMessage = {
  [ErrorType.CONTRACT_ID_NOT_FOUND]: 'Something went wrong. Please try again',
  [ErrorType.NO_ACTIVE_ACCOUNT]: 'Select an account',
  [ErrorType.NO_ACCOUNT_KEY]:
    "This account doesn't seem to be connected properly. Select another account to continue or see the Settings page to import a new account",
  [ErrorType.TASK_NOT_FOUND]:
    "Hmm... We can't find this Task, try a different one",
  [ErrorType.NO_TASK_SOURCECODE]:
    'There was an error collecting the Task information from Arweave. Try again or let us know about the issue',
  [ErrorType.NO_RUNNING_TASK]:
    "All good here, that task isn't running right now",
  [ErrorType.TRANSACTION_TIMEOUT]:
    'Whoops! Your transaction was not confirmed, please try again',
  [ErrorType.GENERIC]: 'Something went wrong. Please try again',
  [ErrorType.NO_MNEMONIC]: 'Please provide a mnemonic to generate wallets',
  [ErrorType.NO_VALID_ACCOUNT_NAME]: false,
};

export const errorContextToSuffix = {
  [ErrorContext.CLAIM_REWARD]: ' to claim a reward on this Task',
  [ErrorContext.DELEGATE_STAKE]: ' to delegate stake on this Task',
  [ErrorContext.GET_EARNED_REWARDS]: ' to get the earned rewards',
  [ErrorContext.GET_PUBLIC_KEY]: ' to get its public key',
  [ErrorContext.GET_STAKING_PUBLIC_KEY]: ' to get its staking public key',
  [ErrorContext.START_TASK]: ' to start this Task',
  [ErrorContext.WITHDRAW_STAKE]: ' to withdraw from this Task',
};
