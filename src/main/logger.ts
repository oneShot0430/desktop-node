import log from 'electron-log';

import { getAppDataPath } from './node/helpers/getAppDataPath';

export function configureLogger() {
  log.transports.file.level = 'info';

  log.transports.file.resolvePath = () => `${getAppDataPath()}/logs/main.log`;

  // overwrite default console with electron-log functions
  Object.assign(console, log.functions);
}
