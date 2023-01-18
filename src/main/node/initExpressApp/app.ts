import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import proxy from 'express-http-proxy';

import koiiState from '../../../services/koiiState';
import koiiTasks from '../../../services/koiiTasks';

import routes from './routes';

const ATTENTION_TASK_ID = 'Attention22222222222222222222222222222222222';

const verifyTaskEndpoints = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const match = req.originalUrl.match(/\/(.*?)\//i);

  let taskActivated = false;
  let isTask = false;

  if (match) {
    const taskId = match[1];
    if (taskId?.length === 43) {
      isTask = true;
      taskActivated = !koiiState.getAddedTasks().every((addedTask) => {
        return addedTask.contractId !== taskId || !addedTask.activated;
      });
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
  // Create alias for first task with name "Attention_Game" to /attention
  const alias = '/attention';
  app.all(alias + '*', function (req, _res, next) {
    if (!req.originalUrl.includes(ATTENTION_TASK_ID)) {
      req.url =
        '/task/' + ATTENTION_TASK_ID + req.originalUrl.slice(alias.length);
      req.originalUrl =
        '/task/' + ATTENTION_TASK_ID + req.originalUrl.slice(alias.length);
    }

    next();
  });
  app.use(
    '/task/:taskid/*',
    taskChecker,
    proxy(
      function (req: any) {
        const taskId = req.params.taskid;
        if (koiiTasks.RUNNING_TASKS[taskId]) {
          console.log(
            `http://localhost:${koiiTasks.RUNNING_TASKS[taskId].expressAppPort}`
          );
          return `http://localhost:${koiiTasks.RUNNING_TASKS[taskId].expressAppPort}`;
        } else {
          return 'http://localhost:8080';
        }
      },
      {
        proxyReqPathResolver: function (req: any) {
          const taskId = req.params.taskid;
          const url = req.originalUrl.replace(`/task/${taskId}`, '');
          console.log({ url });
          return url;
        },
      }
    )
  );
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(verifyTaskEndpoints);
  routes(app);

  return app;
};

function taskChecker(req: any, res: any, next: any) {
  const taskId = req.params.taskid;
  if (req.params['0'] == 'id')
    return res.json({
      taskId,
    });
  if (koiiTasks.RUNNING_TASKS[taskId]) {
    next();
  } else {
    res.status(422).send({ message: `Task ${taskId} not running` });
  }
}
