import errorHandler from 'main/errorHandler';

import getNodes from './getNodes';
import Namespace from './Namespace';
import regNodes from './regNodes';

export default {
  getNodes: errorHandler(getNodes, 'Get nodes error'),
  regNodes: errorHandler(regNodes, 'Register node error'),
  Namespace,
};
