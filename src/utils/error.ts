export enum ErrorType {
  CONTRACT_ID_NOT_FOUND = 'CONTRACT_ID_NOT_FOUND',
  NO_ACTIVE_ACCOUNT = 'NO_ACTIVE_ACCOUNT',
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  NO_TASK_SOURCECODE = 'NO_TASK_SOURCECODE',
  NO_RUNNING_TASK = 'NO_RUNNING_TASK',
  NO_ACCOUNT_KEY = 'NO_ACCOUNT_KEY',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
}

interface ErrorData {
  detailed: string;
  summary: string;
  type: ErrorType;
}

export class DetailedError extends Error {
  detailed: string;
  summary: string;
  type: ErrorType;

  constructor({ detailed, summary, type }: ErrorData) {
    super(detailed);
    this.detailed = detailed;
    this.summary = summary;
    this.type = type;
  }
}
