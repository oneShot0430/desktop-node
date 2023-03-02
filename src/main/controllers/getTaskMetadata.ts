import { Event } from 'electron';

import * as isIPFS from 'is-ipfs';

import axios from 'axios';
import config from 'config';
import { ErrorType, GetTaskMetadataParam, TaskMetadata } from 'models';
import { retrieveFromIPFS } from 'services/ipfs';
import { throwDetailedError } from 'utils';

export const getTaskMetadata = async (
  _: Event,
  { metadataCID }: GetTaskMetadataParam
): Promise<TaskMetadata> => {
  const isTaskDeployedToIPFS = isIPFS.cid(metadataCID);
  const retrieveFromArweave = async (cid: string) =>
    (await axios.get<TaskMetadata>(`${config.node.ARWEAVE_GATEWAY_URL}/${cid}`))
      ?.data;

  try {
    const metadata = isTaskDeployedToIPFS
      ? await retrieveFromIPFS<TaskMetadata>(metadataCID, 'metadata.json')
      : await retrieveFromArweave(metadataCID);

    console.log('metadata: ', metadata);

    return metadata;
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};
