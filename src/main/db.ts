import { LevelDbAdapter } from '@_koii/k2-node';

import { getAppDataPath } from './node/helpers/getAppDataPath';

export default LevelDbAdapter.getInstance(`${getAppDataPath()}/db`);
