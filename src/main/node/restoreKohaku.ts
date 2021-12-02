import config from 'config';
import errorHandler from 'main/errorHandler';
import arweave from 'services/arweave';
import koiiState from 'services/koiiState';
import sdk from 'services/sdk';


const restoreKohaku = async (): Promise<any> => {
  if (config.node.RESTORE_KOHAKU) {
    const restore = await sdk.koiiTools.redisGetAsync('kohaku');

    if (restore) {
      /* 
        Get state from redis and set to kohaku
      */
      await sdk.kohaku.importCache(arweave, restore);

      /* 
        Cache to koiiState
      */
      let cache = await sdk.kohaku.exportCache();
      cache = JSON.parse(cache);

      const state = JSON.parse(cache.contracts[config.node.KOII_CONTRACT].state);
      let tasks = state.tasks;
      
      tasks = await Promise.all(tasks.map(async (task: any) => {
        const taskState = sdk.koiiTools.getState(task.txId);

        return {
          txId: task.txId,
          name: task.name,
          executableId: taskState.executableId
        };
      }));
      state.tasks = tasks;
      koiiState.setState(state);

      console.log('Restore to height ', sdk.kohaku.getCacheHeight());
    }

    return true;
  }

  /* 
    If no data from redis, await to initKohaku()
  */
  return false;
};

export default errorHandler(restoreKohaku, 'Restore Kohaku error');
