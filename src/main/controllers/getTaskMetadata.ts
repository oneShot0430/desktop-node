import { Event } from 'electron';

import { ErrorType, GetTaskMetadataParam, TaskMetadata } from 'models';
import { throwDetailedError } from 'utils';

import { fetchFromIPFSOrArweave } from './fetchFromIPFSOrArweave';

export const getTaskMetadata = async (
  _: Event,
  { metadataCID }: GetTaskMetadataParam
): Promise<TaskMetadata> => {
  try {
    const metadata = fetchFromIPFSOrArweave<TaskMetadata>(
      metadataCID,
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
