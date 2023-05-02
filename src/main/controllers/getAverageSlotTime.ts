import { getAverageSlotTime } from '@koii-network/task-node';
import sdk from 'main/services/sdk';

const getAvgSlotTime = async (): Promise<number> =>
  getAverageSlotTime(sdk.k2Connection);

export default getAvgSlotTime;
