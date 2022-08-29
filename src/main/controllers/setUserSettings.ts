import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';

import mainErrorHandler from '../../utils/mainErrorHandler';

const USER_SETTINGS = 'USER_SETTINGS';

const setUserSettings = async (
  event: Event,
  payload: {
    settings: {
      onboardingCompleted: boolean;
    };
  }
): Promise<boolean> => {
  console.log('IN THE API');
  const { settings } = payload;
  const strigifiedSettings = JSON.stringify(settings);

  try {
    await namespaceInstance.storeSet(USER_SETTINGS, strigifiedSettings);
    return true;
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
};

export default mainErrorHandler(setUserSettings);
