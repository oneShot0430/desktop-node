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
    const metadata = fetchFromIPFSOrArweave<TaskMetadata>(
      payload.metadataCID,
      'metadata.json'
    );
    return metadata;
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_METADATA,
    });
  }
};
