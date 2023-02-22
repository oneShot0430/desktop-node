import fs from 'fs';

import levelup from 'levelup';

import leveldown from 'leveldown';

import { getAppDataPath } from './getAppDataPath';

if (!fs.existsSync(getAppDataPath()))
  fs.mkdirSync(getAppDataPath(), { recursive: true });
export default {
  levelDb: levelup(leveldown(`${getAppDataPath()}/desktopKoiiNodeDB`)),
};
