import { getCacheNodes, namespaceInstance } from './Namespace';

export default async (newNodes: any[], taskId: string) => {
  // Filter stale nodes from registry
  let nodes = await getCacheNodes(taskId);
  console.log(
    `Registry contains ${nodes.length} nodes. Registering ${newNodes.length} more`
  );

  // Verify each registration TODO process promises in parallel
  // eslint-disable-next-line no-param-reassign
  newNodes = newNodes.filter(async (node) => {
    // Filter registrations that don't have an owner or url
    const { owner } = node;
    if (typeof owner !== 'string') {
      console.error('Invalid node input:', node);
      return false;
    }

    return true;
  });

  // Filter out duplicate entries
  const latestNodes: any = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const node of nodes.concat(newNodes)) {
    // Filter registrations that don't have an owner or url
    const { owner } = node;
    if (
      typeof owner !== 'string' ||
      node.data === undefined ||
      typeof node.data.url !== 'string' ||
      typeof node.data.timestamp !== 'number'
    ) {
      console.error('Invalid node input:', node);
      // eslint-disable-next-line no-continue
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
  await namespaceInstance.storeSet(
    `nodeRegistry-${taskId}`,
    JSON.stringify(nodes)
  );

  return newNodes.length > 0;
};
