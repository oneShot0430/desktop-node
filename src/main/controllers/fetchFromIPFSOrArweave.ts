import * as isIPFS from 'is-ipfs';

import axios from 'axios';
import config from 'config';
import { retrieveFromIPFS } from 'services/ipfs';

export const fetchFromIPFSOrArweave = async <T>(
  cid: string,
  fileName: string
) => {
  const isTaskDeployedToIPFS = isIPFS.cid(cid);
  const retrieveFromArweave = async (cid: string) =>
    (await axios.get<T>(`${config.node.ARWEAVE_GATEWAY_URL}/${cid}`))?.data;

  const fileContent = isTaskDeployedToIPFS
    ? await retrieveFromIPFS<T>(cid, fileName)
    : await retrieveFromArweave(cid);

  return fileContent;
};
