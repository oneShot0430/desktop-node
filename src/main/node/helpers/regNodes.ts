import arweave from 'services/arweave';
import koiiState from 'services/koiiState';
import sdk from 'services/sdk';

import getNodes from './getNodes';

export default async (newNodes: any[]) => {
  const state = koiiState.getState();
  let nodes = await getNodes();

  console.log(
    `Registry contains ${nodes.length} nodes. Registering ${newNodes.length} more`
  );

  newNodes = newNodes.filter(async (node) => {
    const owner = node.owner;

    if (typeof owner !== 'string') {
      console.log('Invalid node input: ', node);
      return false;
    }

    return await sdk.koiiTools.verifySignature(node);
  });

  const latestNodes = {} as any;
  for (const node of nodes.concat(newNodes)) {
    const owner = node.owner;
    if (
      typeof owner !== 'string' ||
      node.data === undefined ||
      typeof node.data.url !== 'string' ||
      typeof node.data.timestamp !== 'number'
    ) {
      console.error('Invalid node input:', node);
      continue;
    }

    const address = await arweave.wallets.ownerToAddress(owner);
    if (!(address in state)) {
      console.error('Node tried registering without stake:', address);
      continue;
    }

    const latest = latestNodes[owner];
    if (latest === undefined || node.data.timestamp > latest.data.timestamp) {
      latestNodes[owner] = node;
    }
  }

  nodes = Object.values(latestNodes);

  console.log(`Registry now contains ${nodes.length} nodes`);
  await sdk.koiiTools.redisSetAsync('nodeRegistry', JSON.stringify(nodes));

  return newNodes.length > 0;
};
