import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';
import Arweave from 'arweave';
import axios from 'axios';

import config from 'config';
import { Namespace, namespaceInstance } from 'main/node/helpers/Namespace';
import koiiState from 'services/koiiState';

import mainErrorHandler from '../../utils/mainErrorHandler';
import initExpressApp from '../node/initExpressApp';

import getTaskInfo from './getTaskInfo';

type StartTaskPayload = {
    taskAccountPubKey: string
}
const OPERATION_MODE = 'service';

const startTask = async (event: Event, payload: StartTaskPayload) => {
    const { taskAccountPubKey } = payload;
    if (!await namespaceInstance.redisGet('WALLET_LOCATION')) {
        throw Error('WALLET_LOCATION not specified');
    }
    const mainSystemAccount = Keypair.fromSecretKey(
        Uint8Array.from(
            JSON.parse(
                fsSync.readFileSync(
                    await namespaceInstance.redisGet('WALLET_LOCATION'),
                    'utf-8',
                ),
            ),
        ),
    );

    // TODO: REPLACE WITH koiiState.getTaskInfo
    const taskInfo = getTaskInfo({ taskAccountPubKey });
    const expressApp = await initExpressApp();

    try {
        const url = `${config.node.GATEWAY_URL}/${taskInfo.task_audit_program}`;

        const { data: src } = await axios.get(url);
        const taskSrc =
            loadTaskSource(
                src,
                new Namespace(
                    taskAccountPubKey,
                    expressApp,
                    OPERATION_MODE,
                    mainSystemAccount,
                    taskInfo
                ),
            );
        await taskSrc.setup();
        taskSrc.execute();
    } catch (err) {
        console.error(err);
        throw new Error('Get task source error');
    }
};
const loadTaskSource = (src: string, namespace: Namespace) => {
    const loadedTask = new Function(`
      const [namespace, require] = arguments;
      ${src};
      return {setup, execute};
    `);

    const _require = (module: string) => {
        switch (module) {
            case 'arweave': return Arweave;
            case 'axios': return axios;
            case 'crypto': return () => {/* */ };
        }
    };

    // TODO: Instead of passing require change to _require and allow only selected node modules
    return loadedTask(
        namespace,
        require
    );
};

export default mainErrorHandler(startTask);
