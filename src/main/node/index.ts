import executeTasks from './executeTasks';
import { getMainSystemAccountKeypair } from './helpers';

// import loadTasks from './loadTasks';

// eslint-disable-next-line consistent-return
export const loadAndExecuteTasks = async (): Promise<any> => {
  // if (!process.env.NODE_MODE) throw new Error('env not found');
  /* Connect Redis */
  // await connectRedis(
  //   config.node.REDIS.IP,
  //   config.node.REDIS.PORT
  // );

  try {
    // await startTask(null, {
    //   taskAccountPubKey: 'dGeVfkp1BcLDK13gxoNz5cy4aMMKXVsvSjDAhyLpPCR',
    // });

    // setTimeout(() => {
    //   console.log("STOPPING TASK")
    //   stopTask(null, {
    //     taskAccountPubKey: 'dGeVfkp1BcLDK13gxoNz5cy4aMMKXVsvSjDAhyLpPCR',
    //   })
    // }, 60000)

    if (await getMainSystemAccountKeypair()) {
      /* Loading and Executing last running tasks */
      console.info('Executing TASKS');

      executeTasks();
    }
  } catch (e: any) {
    console.error('ERROR In TASK start', e);
  }
};
