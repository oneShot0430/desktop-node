import Arweave from 'arweave';
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

  const taskSrcs = await Promise.all(
    tasks.map(async (task: any) => {
      const { executableId } = task;
      const url = `${config.node.GATEWAY_URL}/${executableId}`;

      const { data } = await axios.get(url);

      return { src: data, txId: task.txId };
    })
  );

  return taskSrcs.map(({ src, txId }): any => {
    return loadTaskSource(src, new Namespace(txId, app));
  });
};

const loadTaskSource = (src: string, namespace: Namespace) => {
  const loadedTask = new Function(`
    const [tools, namespace, require] = arguments;
    ${src};
    return {setup, execute};
  `);

  const _require = (module: string) => {
    switch (module) {
      case 'arweave':
        return Arweave;
      case '@_koi/kohaku':
        return sdk.kohaku;
      case 'axios':
        return axios;
      case 'crypto':
        return () => {
          /* */
        };
    }
  };

  return loadedTask(sdk.koiiTools, namespace, _require);
};

export default errorHandler(loadTasks, 'Load tasks error');
