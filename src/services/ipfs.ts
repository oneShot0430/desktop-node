import config from 'config';
import { getStoredTaskVariables } from 'main/controllers/taskVariables/getStoredTaskVariables';
import { ErrorType } from 'models';
import fetch from 'node-fetch';
import { throwDetailedError } from 'utils';
import { Web3Storage } from 'web3.storage';

function makeStorageClient(token: string) {
  return new Web3Storage({ token });
}

export async function retrieveFromIPFS(
  cid: string,
  fileName: string
): Promise<string> {
  const storedTaskVariables = await getStoredTaskVariables();
  const userWeb3StorageKey = Object.values(storedTaskVariables).find(
    ({ label }) => label === 'WEB3_STORAGE_KEY'
  )?.value;

  if (userWeb3StorageKey) {
    try {
      const client = makeStorageClient(userWeb3StorageKey);
      return retrieveThroughClient(client, cid);
    } catch (error: any) {
      return throwDetailedError({
        detailed: error,
        type: ErrorType.GENERIC,
      });
    }
  } else {
    return retrieveThroughHttpGateway(cid, fileName);
  }
}

async function retrieveThroughClient(
  client: Web3Storage,
  cid: string
): Promise<string> {
  console.log('use Web3.storage client');
  const response = await client.get(cid);
  if (!response?.ok) {
    return throwDetailedError({
      detailed: `Failed to get ${cid} from IPFS`,
      type: ErrorType.GENERIC,
    });
  }
  const files = await response.files();
  const textDecoder = new TextDecoder();
  return textDecoder.decode(await files[0].arrayBuffer());
}

async function retrieveThroughHttpGateway(
  cid: string,
  fileName = ''
): Promise<string> {
  console.log('use IPFS HTTP gateway');
  const fileContent = await fetch(
    `${config.node.IPFS_GATEWAY_URL}/${cid}/${fileName}`
  ).then((res) => res.text());
  return fileContent;
}
