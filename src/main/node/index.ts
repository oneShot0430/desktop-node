import config from 'config';
import koiiState from 'services/koiiState';

import helpers from './helpers';


export default async (): Promise<any> => {
  /* Connect Redis */
  await helpers.connectRedis(
    config.node.REDIS.IP,
    config.node.REDIS.PORT
  );

  /* Restore koiiState from Redis */
  await helpers.restoreKohaku();

  /* Init Express server */


  /* Get tasks */

  
  /* Execute tasks */
};
