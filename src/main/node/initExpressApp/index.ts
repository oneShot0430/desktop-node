import { Request, Response, Express } from 'express';
import koiiState from 'main/services/koiiState';

import config from '../../../config';
import errorHandler from '../../errorHandler';

import app from './app';

let isExpressListening = false;
const initExpressApp = async (): Promise<Express | undefined> => {
  // skip stake for now

  if (isExpressListening) return;
  isExpressListening = true;
  const expressApp = app();

  expressApp.get('/id', (req: Request, res: Response) => {
    res.send(config.node.TASK_CONTRACT_ID);
  });

  expressApp.get('/tasks', (req: Request, res: Response) => {
    let tasks = koiiState.getTasks();

    tasks = tasks.map((task: any) => task.name);

    res.status(200).send(tasks);
  });

  const port = config.node.SERVER_PORT;
  expressApp.listen(port, () => {
    console.log(`Express server started @ http://localhost:${port}`);
  });

  // eslint-disable-next-line consistent-return
  return expressApp;
};

export default errorHandler(initExpressApp, 'Init Express app error');
