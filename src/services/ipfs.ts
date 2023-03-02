import { Web3Storage } from 'web3.storage';

import axios from 'axios';
import config from 'config';
import { getStoredTaskVariables } from 'main/controllers/taskVariables/getStoredTaskVariables';
import { ErrorType } from 'models';
import { throwDetailedError } from 'utils';

function makeStorageClient(token: string) {
  return new Web3Storage({ token });
}

export async function retrieveFromIPFS<T>(cid: string, fileName: string) {
  const storedTaskVariables = await getStoredTaskVariables();
  const userWeb3StorageKey = Object.values(storedTaskVariables).find(
    ({ label }) => label === 'WEB3_STORAGE_KEY'
  )?.value;

  if (userWeb3StorageKey) {
    try {
      const client = makeStorageClient(userWeb3StorageKey);
      return retrieveThroughClient<T>(client, cid);
    } catch (error: any) {
      return throwDetailedError({
        detailed: error,
        type: ErrorType.GENERIC,
      });
    }
  } else {
    return retrieveThroughHttpGateway<T>(cid, fileName);
  }
}

async function retrieveThroughClient<T>(
  client: Web3Storage,
  cid: string
): Promise<T> {
  const response = await client.get(cid);
  if (!response?.ok) {
    return throwDetailedError({
      detailed: `Failed to get ${cid} from IPFS`,
      type: ErrorType.GENERIC,
    });
  }
  const files = await response.files();
  const textDecoder = new TextDecoder();
  const fileContent = JSON.parse(
    textDecoder.decode(await files[0].arrayBuffer())
  );
  console.log('used Web3storage');
  return fileContent;
}

async function retrieveThroughHttpGateway<T>(
  cid: string,
  fileName = ''
): Promise<T> {
  const { data: fileContent } = await axios.get<T>(
    `${config.node.IPFS_GATEWAY_URL}/${cid}/${fileName}`
  );
  console.log('used IPFS HTTP gateway');
  return fileContent;
}
