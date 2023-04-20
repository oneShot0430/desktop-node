import { loadAndExecuteTasks } from 'main/node';
import koiiTasks from 'main/services/koiiTasks';
import { ErrorType } from 'models';
import { throwDetailedError } from 'utils';

export const initializeTasks = async (): Promise<void> => {
  try {
    await koiiTasks.initializeTasks();
    await loadAndExecuteTasks();
  } catch (err) {
    return throwDetailedError({
      detailed: 'Node initialization failed. Please, try to restart your Node.',
      type: ErrorType.NODE_INITIALIZATION_FAILED,
    });
  }
};
