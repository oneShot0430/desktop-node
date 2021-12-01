import { Request, Response, Express } from 'express';

import config from 'config';
import errorHandler from 'main/errorHandler';
import koiiState from 'services/koiiState';

import app from './app';

const initExpressApp = async () => {
  // skip stake for now

  const expressApp = app();

  expressApp.get('/id', (req: Request, res: Response) => {
    res.send(config.node.KOII_CONTRACT);
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

  return expressApp;
};

export default errorHandler(initExpressApp, 'Init Express app error');
