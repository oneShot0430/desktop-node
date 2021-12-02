
import kohaku from '@_koi/kohaku';
import { Node } from '@_koi/sdk/node';

import config from 'config';


const koiiTools = new Node(
  config.node.BUNDLER_URL, 
  config.node.KOII_CONTRACT
);


export default {
  kohaku,
  koiiTools
};
