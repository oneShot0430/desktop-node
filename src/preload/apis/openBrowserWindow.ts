import { OpenBrowserWindowParam } from 'models';

import config from '../../config';
import sendMessage from '../sendMessage';

export default (payload: OpenBrowserWindowParam) =>
  sendMessage(config.endpoints.OPEN_BROWSER_WINDOW, payload);
