import fs from 'fs';

import leveldown from 'leveldown';
import levelup from 'levelup';

import { getAppDataPath } from './getAppDataPath';

if (!fs.existsSync(getAppDataPath()))
  fs.mkdirSync(getAppDataPath(), { recursive: true });
export default {
  levelDb: levelup(leveldown(getAppDataPath() + '/desktopKoiiNodeDB')),
};
