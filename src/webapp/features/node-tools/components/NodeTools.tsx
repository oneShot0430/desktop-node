import React from 'react';

import { NodeTool } from './NodeTool';

const nodeToolsMock = ['Web3_Storage_key', 'IPFS_key', 'Pinata_key'];

export const NodeTools = () => {
  return (
    <div className="w-full">
      {nodeToolsMock.map((tool) => (
        <NodeTool tool={tool} key={tool} getSecretLink="https://google.com" />
      ))}
    </div>
  );
};
