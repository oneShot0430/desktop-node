import { SystemDbKeys } from 'config/systemDbKeys';
import { namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType, TaskToMigrate } from 'models';
import { throwDetailedError } from 'utils';

import { getTasksToMigrate } from './getTasksToMigrate';

export const storeTaskToMigrate = async (
  newTaskToMigrate: TaskToMigrate
): Promise<boolean> => {
  console.log({ newTaskToMigrate });
  try {
    const tasksToMigrate = await getTasksToMigrate();
    const updatedTasksToMigrate = {
      ...tasksToMigrate,
      [newTaskToMigrate.publicKey]: newTaskToMigrate,
    };
    const stringifiedTasksToMigrate = JSON.stringify(updatedTasksToMigrate);
    await namespaceInstance.storeSet(
      SystemDbKeys.EmergencyTasksToMigrate,
      stringifiedTasksToMigrate
    );
    return true;
  } catch (error) {
    console.error('STORE TASKS TO MIGRATE: ', error);
    return throwDetailedError({
      detailed: `${error}`,
      type: ErrorType.GENERIC,
    });
  }
};
