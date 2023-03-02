import * as isIPFS from 'is-ipfs';

import axios from 'axios';
import config from 'config';
import { ErrorType } from 'models';
import { retrieveFromIPFS } from 'services/ipfs';
import { throwDetailedError } from 'utils';

export const fetchFromIPFSOrArweave = async <T>(
  cid: string,
  fileName: string
) => {
  const isTaskDeployedToIPFS = isIPFS.cid(cid);
  const retrieveFromArweave = async (cid: string) =>
    (await axios.get<T>(`${config.node.ARWEAVE_GATEWAY_URL}/${cid}`))?.data;

  try {
    const fileContent = isTaskDeployedToIPFS
      ? await retrieveFromIPFS<T>(cid, fileName)
      : await retrieveFromArweave(cid);

    return fileContent;
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};
