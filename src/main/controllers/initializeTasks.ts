import { loadAndExecuteTasks } from 'main/node';
import koiiTasks from 'main/services/koiiTasks';
import { ErrorType } from 'models';
import { throwDetailedError } from 'utils';

export const initializeTasks = async (): Promise<void> => {
  try {
    await koiiTasks.initializeTasks();
    await loadAndExecuteTasks();
  } catch (err) {
    console.log('INITIALIZATION ERROR', err);
    // TODO(Chris) err after stringify in "throwDetailedError" is {}
    return throwDetailedError({
      detailed: err as string,
      type: ErrorType.NODE_INITIALIZATION_FAILED,
    });
  }
};
