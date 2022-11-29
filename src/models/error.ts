export interface DetailedError {
  detailed: string;
  type: ErrorType;
}

export enum ErrorType {
  CONTRACT_ID_NOT_FOUND = 'CONTRACT_ID_NOT_FOUND',
  NO_ACTIVE_ACCOUNT = 'NO_ACTIVE_ACCOUNT',
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  NO_TASK_SOURCECODE = 'NO_TASK_SOURCECODE',
  NO_RUNNING_TASK = 'NO_RUNNING_TASK',
  NO_ACCOUNT_KEY = 'NO_ACCOUNT_KEY',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  NO_MNEMONIC = 'NO_MNEMONIC',
  NO_VALID_ACCOUNT_NAME = 'NO_VALID_ACCOUNT_NAME',
  GENERIC = 'GENERIC',
  DUPLICATE_ACCOUNT = 'DUPLICATE_ACCOUNT',
}

export enum NetworkErrors {
  TRANSACTION_TIMEOUT = 'transaction was not confirmed',
}
