import errorHandler from 'main/errorHandler';
import koiiState from 'services/koiiState';
import sdk from 'services/sdk';

const initKohaku = async (): Promise<any> => {
  /* 
    Fetch state for koiiState
  */
  const state = await sdk.koiiTools.getKoiiStateAwait();
  const initialHeight = sdk.kohaku.getCacheHeight();

  console.log('Kohaku initialized to height', sdk.kohaku.getCacheHeight());
  if (initialHeight < 1) throw new Error('Failed to initialize kohaku');

  koiiState.setState(state);
};

export default errorHandler(initKohaku, 'Init Kohaku error');
