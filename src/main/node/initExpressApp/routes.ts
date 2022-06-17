import { Request, Response, Express } from 'express';


import helpers from '../helpers';

const heartbeat = (req: Request, res: Response): void => {
  res.status(200).send(
    '<body style="background:black"><img src="https://media.giphy.com/media/OMD2Ca7SN87gQ/giphy.gif" style="width:100vw;height:auto"></img></body>'
  );
};


const nodes = async (req: Request, res: Response): Promise<any> => {
  try {
    const nodes = await helpers.getNodes();
    res.status(200).send(nodes);
  } catch (err) {
    console.error('Error during "nodes" request:', err);
    res.status(500).send({ error: 'ERROR: ' + err });
  }
};

const registerNodes = async (req: Request, res: Response): Promise<any> => {
  try {
    const regRes = await helpers.regNodes([req.body]);
    if (regRes) {
      res.status(200).end();
    } else {
      res.status(409).json({
        message: 'Registration is duplicate, outdated, or invalid'
      });
    }
  } catch (err) {
    console.error('Error during "register-node" request:', err);
    res.status(500).send({ error: 'ERROR: ' + err });
  }
};

export default (app: Express) => {
  app.get('/', heartbeat);
  app.get('/nodes', nodes);
  app.post('/register-node', registerNodes);
};
