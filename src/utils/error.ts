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
