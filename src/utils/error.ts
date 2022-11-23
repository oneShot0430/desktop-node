import { DetailedError, ErrorType, ErrorContext } from 'models';

export const isDetailedError = (
  error: Error | DetailedError
): error is DetailedError => {
  return 'type' in error;
};

export const getErrorToDisplay = (error: Error) => {
  if (!error) return undefined;

  const relevantErrorDataStringified = error.message.substring(
    error.message.indexOf('{')
  );

  const parsedError: Error | DetailedError = JSON.parse(
    relevantErrorDataStringified
  );
  console.log('parsedError: ', parsedError);

  if (isDetailedError(parsedError)) {
    return `${errorTypeToMessage[parsedError.type] || parsedError.detailed}${
      errorContextToContextSuffix[parsedError.context]
    }.`;
  } else {
    return error?.message;
  }
};

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

export const errorTypeToMessage = {
  [ErrorType.CONTRACT_ID_NOT_FOUND]: 'Something went wrong. Please try again',
  [ErrorType.NO_ACTIVE_ACCOUNT]: 'Select an account',
  [ErrorType.NO_ACCOUNT_KEY]:
    "This account doesn't seem to be connected properly. Select another account to continue or see the Settings page to import a new account",
  [ErrorType.TASK_NOT_FOUND]:
    "Hmm... We can't find this Task, try a different one.",
  [ErrorType.NO_TASK_SOURCECODE]:
    'There was an error collecting the Task information from Arweave. Try again or let us know about the issue.',
  [ErrorType.NO_RUNNING_TASK]:
    "All good here, that task isn't running right now.",
  [ErrorType.TRANSACTION_TIMEOUT]:
    'Whoops! Your transaction was not confirmed, please try again.',
  [ErrorType.GENERIC]: 'Something went wrong. Please try again',
  [ErrorType.NO_MNEMONIC]: 'Please provide a mnemonic to generate wallets',
  [ErrorType.NO_VALID_ACCOUNT_NAME]: false,
};

export const errorContextToContextSuffix = {
  [ErrorContext.CLAIM_REWARD]: ' to claim a reward on this Task',
  [ErrorContext.DELEGATE_STAKE]: ' to delegate stake on this Task',
  [ErrorContext.GET_EARNED_REWARDS]: ' to get the earned rewards',
  [ErrorContext.GET_PUBLIC_KEY]: ' to get its public key',
  [ErrorContext.GET_STAKING_PUBLIC_KEY]: ' to get its staking public key',
  [ErrorContext.START_TASK]: ' to start this Task',
  [ErrorContext.WITHDRAW_STAKE]: ' to withdraw from this Task',
};

// export class DetailedError extends Error {
//   detailed: string;
//   // summary: string;
//   type: ErrorType;
//   context?: ErrorContext;

//   constructor({ detailed, context, type }: DetailedError) {
//     super(detailed);
//     this.detailed = detailed;
//     this.type = type;
//     this.context = context;
//   }
// }

// export const getErrorToDisplay = (error: Error | DetailedError) => {
//   if (!error) return undefined;

//   if (isDetailedError(error)) {
//     return `${errorTypeToMessage[error.type]}${
//       errorContextToContextSuffix[error.context]
//     }.`;
//   } else {
//     return error?.message;
//   }
// };
