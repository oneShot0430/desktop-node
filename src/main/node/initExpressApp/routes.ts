import { Request, Response, Express } from 'express';

import koiiTasks from '../../../services/koiiTasks';
import helpers from '../helpers';

const heartbeat = (req: Request, res: Response): void => {
  res
    .status(200)
    .send(
      '<body style="background:black"><img src="https://media.giphy.com/media/OMD2Ca7SN87gQ/giphy.gif" style="width:100vw;height:auto"></img></body>'
    );
};

const nodes = async (req: Request, res: Response): Promise<any> => {
  try {
    const nodes = await helpers.getNodes();
    res.status(200).send(nodes);
  } catch (err) {
    console.error('Error during "nodes" request:', err);
    res.status(500).send({ error: `ERROR: ${err}` });
  }
};

const registerNodes = async (req: Request, res: Response): Promise<any> => {
  try {
    const regRes = await helpers.regNodes([req.body]);
    if (regRes) {
      res.status(200).end();
    } else {
      res.status(409).json({
        message: 'Registration is duplicate, outdated, or invalid',
      });
    }
  } catch (err) {
    console.error('Error during "register-node" request:', err);
    res.status(500).send({ error: `ERROR: ${err}` });
  }
};

export default (app: Express) => {
  app.get('/', heartbeat);
  app.get('/nodes', nodes);
  app.post('/register-node', registerNodes);
  app.post('/namespace-wrapper', async (req, res) => {
    if (!req.body.args)
      return res.status(422).send({ message: 'No args provided' });
    if (!req.body.taskId)
      return res.status(422).send({ message: 'No taskId provided' });
    if (!req.body.secret)
      return res.status(422).send({ message: 'No secret provided' });

    const { args } = req.body;
    const { taskId } = req.body;
    if (koiiTasks.RUNNING_TASKS[taskId].secret != req.body.secret) {
      return res.status(401).send({ message: 'Invalid secret provided' });
    }
    try {
      const params = args.slice(1);
      const response = await (koiiTasks.RUNNING_TASKS[taskId] as any).namespace[
        args[0]
      ](...params);
      res.status(200).send({ response });
    } catch (err: any) {
      res.status(422).send({ message: err.message });
    }
  });
};
