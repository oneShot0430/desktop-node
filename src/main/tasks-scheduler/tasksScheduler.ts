import { startAllTasks } from '../controllers/startAllTasks';
import { stopAllTasks } from '../controllers/stopAllTask';
import { namespaceInstance } from '../node/helpers/Namespace';

import { TaskSchedulerService } from './TaskSchedulerService';

const taskScheduler = new TaskSchedulerService(
  namespaceInstance,
  () => {
    console.log('###### Scheduler is starting scheduled tasks');
    return startAllTasks({} as Event, { runOnlyScheduledTasks: true });
  },
  () => {
    console.log('###### Scheduler is stopping scheduled tasks');
    return stopAllTasks({} as Event, { runOnlyScheduledTasks: true });
  }
);

export default taskScheduler;
