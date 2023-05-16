import { Event } from 'electron';

import { ErrorType, GetTaskMetadataParam, TaskMetadata } from 'models';
import { throwDetailedError } from 'utils';

import { fetchFromIPFSOrArweave } from './fetchFromIPFSOrArweave';

export const getTaskMetadata = async (
  _: Event,
  payload: GetTaskMetadataParam
): Promise<TaskMetadata> => {
  // payload validation
  if (!payload?.metadataCID) {
    throw throwDetailedError({
      detailed: 'Get Task Metadata error: payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  try {
    const tooManyRequestsErrorRegex = /<[^>]*>429 Too Many Requests<[^>]*>/g;

    const result = await fetchFromIPFSOrArweave(
      payload.metadataCID,
      'metadata.json'
    );

    if (tooManyRequestsErrorRegex.test(result)) {
      return throwDetailedError({
        detailed: '429 Too Many Requests',
        type: ErrorType.TOO_MANY_REQUESTS,
      });
    }

    const metadata = JSON.parse(result);
    return metadata as TaskMetadata;
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_METADATA,
    });
  }
};
