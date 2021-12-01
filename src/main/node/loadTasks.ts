import axios from 'axios';
import { Express } from 'express';

import config from 'config';
import errorHandler from 'main/errorHandler';
import koiiState from 'services/koiiState';
import sdk from 'services/sdk';

import Namespace from './helpers/Namespace';


const loadTasks = async (app: Express) => {
  let tasks = koiiState.getTasks();
  tasks = tasks.filter((task: any) => !!task.executableId);

  const taskSrcs = await Promise.all(tasks.map(async (task: any) => {
    const { executableId } = task;
    const url = `${config.node.GATEWAY_URL}/${executableId}`;

    const { data } = await axios.get(url);

    return { src: data, txId: task.txId };
  }));
  
  return taskSrcs.map(({ src, txId }): any => {


    const loadedTask = new Function(`
      const [tools, namespace, require] = arguments;
      ${src}
      return { setup, execute }
    `);

    // return loadedTask(
    //   sdk.koiiTools, 
    //   namespace, 
    //   require
    // );
  });
};

// const loadTaskSource = (src: string, namespace: Namespace) => {

// };

export default errorHandler(loadTasks, 'Load tasks error');
