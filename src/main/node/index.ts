import config from 'config';
import koiiState from 'services/koiiState';

import connectRedis from './connectRedis';
import initExpressApp from './initExpressApp';
import initKohaku from './initKohaku';
import restoreKohaku from './restoreKohaku';



export default async (): Promise<any> => {
  /* Connect Redis */
  await connectRedis(
    config.node.REDIS.IP,
    config.node.REDIS.PORT
  );

  /* Restore koiiState from Redis */
  const hasCachedData = await restoreKohaku();

  /* Init kohaku */
  if (hasCachedData) {
    initKohaku();
  } else {
    await initKohaku();
  }

  const state = koiiState.getState();
  console.log('===== Tasks =====');
  console.log(state.tasks);

  /* Init Express app */
  const expressApp = await initExpressApp();

  /* Load tasks */


  /* Execute tasks */
};
