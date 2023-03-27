import { INode } from '@koii-network/task-node';
import axios from 'axios';

import db from '../../db';
import { NodeNamespace } from '../../NodeNamespace';

import { getRpcUrlWrapper } from './getRpcUrlWrapper';

const BUNDLER_NODES = '/nodes';

// Singletons
/**
 * Namespace wrapper over APIs needed in Koii tasks
 */
const namespaceInstance = new NodeNamespace({
  taskTxId: '',
  serverApp: null,
  mainSystemAccount: null,
  taskData: {},
  db,
  rpcUrl: getRpcUrlWrapper(),
});

/**
 * Gets the node registry from Redis cache
 * @returns {Array<BundlerPayload<data:RegistrationData>>}
 */
async function getCacheNodes() {
  // Get nodes from cache
  let nodes;
  try {
    nodes = JSON.parse(
      (await namespaceInstance.storeGet('nodeRegistry')) || '[]'
    );
    if (nodes === null) nodes = [];
  } catch (e: any) {
    console.error(e);
    nodes = [];
  }
  return nodes as Array<INode>;
}

/**
 * Gets an array of service nodes
 * @param url URL of the service node to retrieve the array from a known service node
 * @returns Array of service nodes
 */
async function getNodes(url: string): Promise<Array<INode>> {
  try {
    const res = await axios.get<INode[]>(url + BUNDLER_NODES);
    console.log('RESPOSNE FROM GET NODES', res.data);
    return res.data;
  } catch (_e) {
    return [];
  }
}

/**
 * Adds an array of nodes to the local registry
 * @param {Array<NodeRegistration>} newNodes
 * @returns {boolean} Wether some new nodes were added or not
 */
async function registerNodes(newNodes: any) {
  // Filter stale nodes from registry
  let nodes = await getCacheNodes();
  console.log(
    `Registry contains ${nodes.length} nodes. Registering ${newNodes.length} more`
  );

  // Verify each registration TODO process promises in parallel
  // eslint-disable-next-line no-param-reassign
  newNodes = newNodes.filter(async (node: any) => {
    // Filter registrations that don't have an owner or url
    const { owner } = node;
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

    // Filter addresses that don't have a stake
    // const address = await arweave.wallets.ownerToAddress(owner);

    // // TODO: Get the stake for each address
    // if (!(address in state.stakes)) {
    //     console.error("Node tried registering without stake:", address);
    //     continue;
    // }

    // Make this node the latest if the timestamp is more recent
    const latest = latestNodes[owner];
    if (latest === undefined || node.data.timestamp > latest.data.timestamp)
      latestNodes[owner] = node;
  }

  nodes = Object.values(latestNodes);

  // Update registry
  console.log(`Registry now contains ${nodes.length} nodes`);
  await namespaceInstance.storeSet('nodeRegistry', JSON.stringify(nodes));

  return newNodes.length > 0;
}

export {
  NodeNamespace as Namespace,
  getNodes,
  registerNodes,
  getCacheNodes,
  namespaceInstance,
};
