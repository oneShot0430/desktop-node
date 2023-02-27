import { Web3Storage } from 'web3.storage';

import axios from 'axios';
import config from 'config';
import { getStoredTaskVariables } from 'main/controllers/taskVariables/getStoredTaskVariables';
import { ErrorType } from 'models';
import { throwDetailedError } from 'utils';

function makeStorageClient(token: string) {
  return new Web3Storage({ token });
}

export async function retrieveFromIPFS(cid: string) {
  const storedTaskVariables = await getStoredTaskVariables();
  const userWeb3StorageKey = Object.values(storedTaskVariables).find(
    ({ label }) => label === 'WEB3_STORAGE_KEY'
  )?.value;

  if (userWeb3StorageKey) {
    try {
      const client = makeStorageClient(userWeb3StorageKey);

      const containerRes = await client.get(cid);
      console.log(
        `Got a response! [${containerRes?.status}] ${containerRes?.statusText}`
      );
      if (!containerRes?.ok) {
        throw new Error(`failed to get ${cid}`);
      }

      const files = await containerRes.files();
      const sourceCodeCid = files[0].cid;
      const sourceCodeRes = await client.get(sourceCodeCid);
      if (!sourceCodeRes?.ok) {
        throw new Error(`failed to get ${cid}`);
      }

      const sourceCode = await streamToString(sourceCodeRes.body);
      console.log('sourceCode: ', sourceCode);
      console.log('used Web3storage to get the source code');

      return sourceCode;
    } catch (error: any) {
      return throwDetailedError({
        detailed: error,
        type: ErrorType.GENERIC,
      });
    }
  } else {
    const { data: sourceCode } = await axios.get<string>(
      `${config.node.IPFS_GATEWAY_URL}/${cid}/main.js`
    );
    console.log('used the HTTP gateway to get the source code');

    return sourceCode;
  }
}

async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}
