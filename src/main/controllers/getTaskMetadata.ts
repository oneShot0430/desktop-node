import { Event } from 'electron';

import { GetTaskMetadataParam, TaskMetadata } from 'models';

import { fetchFromIPFSOrArweave } from './fetchFromIPFSOrArweave';

export const getTaskMetadata = async (
  _: Event,
  { metadataCID }: GetTaskMetadataParam
): Promise<TaskMetadata> => {
  const metadata = fetchFromIPFSOrArweave<TaskMetadata>(
    metadataCID,
    'metadata.json'
  );

  return metadata;
};
