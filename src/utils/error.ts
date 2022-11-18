import { DetailedErrorType, ErrorType } from 'models';

export class DetailedError extends Error {
  detailed: string;
  summary: string;
  type: ErrorType;

  constructor({ detailed, summary, type }: DetailedErrorType) {
    super(detailed);
    this.detailed = detailed;
    this.summary = summary;
    this.type = type;
  }
}

// TO DO: Improve typing, unknown is a primitive and it's not allowed for this type-guard check
export const isDetailedError = (error: any): error is DetailedErrorType => {
  return 'detailed' in error;
};
