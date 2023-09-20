import { Event } from 'electron';

import koiiTasks from 'main/services/koiiTasks';

import { getRunnedPrivateTasks } from './privateTasks';
import startTask from './startTask';
import { getSchedulerTasks } from './tasksScheduler/getSchedulerTasks';

type StartAllTasksParams = {
  runOnlyScheduledTasks?: boolean;
};

export const startAllTasks = async (
  _: Event,
  { runOnlyScheduledTasks }: StartAllTasksParams = {}
) => {
  const startedTasks = koiiTasks.getStartedTasks();
  const shcedulerTasks = await getSchedulerTasks({} as Event);

  startedTasks.forEach(async (rawTaskData) => {
    if (!rawTaskData.is_running) {
      const privateTasks = await getRunnedPrivateTasks();
      const isPrivate = privateTasks.includes(rawTaskData.task_id);

      /**
       * @dev if actions is triggered by tasks scheduler, we should start only scheduled tasks
       */
      if (
        runOnlyScheduledTasks &&
        !shcedulerTasks.includes(rawTaskData.task_id)
      ) {
        console.warn(`Task ${rawTaskData.task_id} isn't scheduled, skip it.`);
        return;
      }

      await startTask({} as Event, {
        taskAccountPubKey: rawTaskData.task_id,
        isPrivate,
      });
    }
  });
};
