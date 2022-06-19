import arweave from 'services/arweave';
import koiiState from 'services/koiiState';

import { getCacheNodes, namespaceInstance } from './Namespace';

export default async (newNodes: any[]) => {
  // Filter stale nodes from registry
  let nodes = await getCacheNodes();
  console.log(
    `Registry contains ${nodes.length} nodes. Registering ${newNodes.length} more`
  );

  // Verify each registration TODO process promises in parallel
  newNodes = newNodes.filter(async (node) => {
    // Filter registrations that don't have an owner or url
    const owner = node.owner;
    if (typeof owner !== 'string') {
      console.error('Invalid node input:', node);
      return false;
    }

    // TODO: Filter addresses with an invalid signature
    // return await tools.verifySignature(node);
    return true;
  });

  // Filter out duplicate entries
  const latestNodes: any = {};
  for (const node of nodes.concat(newNodes)) {
    // Filter registrations that don't have an owner or url
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
    // Make this node the latest if the timestamp is more recent
    const latest = latestNodes[owner];
    if (latest === undefined || node.data.timestamp > latest.data.timestamp)
      latestNodes[owner] = node;
  }

  nodes = Object.values(latestNodes);

  // Update registry
  console.log(`Registry now contains ${nodes.length} nodes`);
  await namespaceInstance.redisSet('nodeRegistry', JSON.stringify(nodes));

  return newNodes.length > 0;
};
