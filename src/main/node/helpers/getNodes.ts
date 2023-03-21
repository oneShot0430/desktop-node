import { INode } from '@_koii/k2-node';

import { getCacheNodes } from './Namespace';

// get returntype of getCacheNodes
type GetCacheNodesReturnType = ReturnType<typeof getCacheNodes>;

export default async (): Promise<any> => {
  let nodes: Array<INode> = [];
  try {
    nodes = await getCacheNodes();
  } catch (err: any) {
    console.error('Get nodes error: ', err.message);
  }

  return nodes;
};
