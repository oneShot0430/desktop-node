import { SystemDbKeys } from 'config/systemDbKeys';
import { namespaceInstance } from 'main/node/helpers/Namespace';
import { TaskToMigrate, ErrorType, TasksToMigrate } from 'models';

import { throwDetailedError } from '../../utils';

export const getTasksToMigrate = async (): Promise<TasksToMigrate> => {
  try {
    const tasksToMigrateStringified: string = await namespaceInstance.storeGet(
      SystemDbKeys.EmergencyTasksToMigrate
    );
    const tasksToMigrate =
      (JSON.parse(tasksToMigrateStringified) as Record<
        string,
        TaskToMigrate
      >) || {};
    console.log({ tasksToMigrate });
    return tasksToMigrate;
  } catch (error: unknown) {
    console.error('GET TASKS TO MIGRATE: ', error);
    return throwDetailedError({
      detailed: `${error}`,
      type: ErrorType.GENERIC,
    });
  }
};
