import { ArchiveTaskParams } from 'models';

import koiiTasks from '../services/koiiTasks';

export const archiveTask = async (_: Event, payload: ArchiveTaskParams) =>
  koiiTasks.removeTaskFromStartedTasks(payload.taskPubKey);
