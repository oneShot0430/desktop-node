import config from 'config';
import arweave from 'services/arweave';
import koiiState from 'services/koiiState';
import sdk from 'services/sdk';

export default async (): Promise<any> => {
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
      koiiState.setState(cache.contracts[config.node.KOII_CONTRACT].state);

      console.log('Restore to height ', sdk.kohaku.getCacheHeight());
    }

    return true;
  }

  /* 
    If no data from redis, await to initKohaku()
  */
  return false;
};
