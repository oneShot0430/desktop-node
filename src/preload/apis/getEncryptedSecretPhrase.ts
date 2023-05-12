import config from 'config';
import {
  GetEncryptedSecretPhraseParam,
  GetEncryptedSecretPhraseResponse,
} from 'models';

import sendMessage from '../sendMessage';

export default (
  payload: GetEncryptedSecretPhraseParam
): Promise<GetEncryptedSecretPhraseResponse> =>
  sendMessage(config.endpoints.GET_ENCRYPTED_SECRET_PHRASE, payload);
