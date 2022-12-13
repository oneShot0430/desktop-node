import { Event } from 'electron';

import { GetSecretParam } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getSecret = async (
  event: Event,
  payload: GetSecretParam
): Promise<GetSecretParam> => {
  /*
   *TODO: review getTaskSourceCode() then fetch the source code
   */
};

export default mainErrorHandler(getSecret);
