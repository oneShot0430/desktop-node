import errorHandler from 'main/errorHandler';

import connectRedis from './connectRedis';
import restoreKohaku from './restoreKohaku';

export default {
  connectRedis: errorHandler(connectRedis, 'Connect Redis error: '),
  restoreKohaku: errorHandler(restoreKohaku, 'Restore Kohaku error: ')
};
