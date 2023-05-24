import { LevelDbAdapter } from '@koii-network/task-node';

import { getAppDataPath } from './node/helpers/getAppDataPath';

export default LevelDbAdapter.getInstance(`${getAppDataPath()}/db`);
