import leveldown from 'leveldown';
import levelup from 'levelup';

import { getAppDataPath } from './getAppDataPath';

export default {
  levelDb: levelup(leveldown(getAppDataPath() + '/desktopKoiiNodeDB')),
};
