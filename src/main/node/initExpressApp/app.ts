import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express ,Request, Response, NextFunction } from 'express';

import koiiState from 'services/koiiState';

import routes from './routes';


const verifyTaskEndpoints = (req: Request, res: Response, next: NextFunction): void => {
  const match = req.originalUrl.match(/\/(.*?)\//i);

  let taskActivated = false;
  let isTask = false;

  if (match) {
    const taskId = match[1];
    if (taskId?.length === 43) {
      isTask = true;
      taskActivated = !(koiiState.getAddedTasks().every(addedTask => {
        return addedTask.contractId !== taskId || !addedTask.activated;
      }));
    }
  }

  if (!taskActivated && isTask) {
    res.status(400).send('This service has been stopped.');
  } else {
    next();
  }
};

export default (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(verifyTaskEndpoints);
  routes(app);
  
  return app;
};
