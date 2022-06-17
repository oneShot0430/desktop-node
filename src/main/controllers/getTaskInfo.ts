import { Event } from 'electron';

import {
    PublicKey
} from '@_koi/web3.js';
import axios from 'axios';

import config from 'config';
import koiiState from 'services/koiiState';
import sdk from 'services/sdk';

import mainErrorHandler from '../../utils/mainErrorHandler';


interface GetTaskInfoParam {
    taskAccountPubKey: string
}
interface TaskState {
    taskName: string,
    taskManager: string,
    isWhitelisted: boolean,
    isActive: boolean,
    taskAuditProgram: string,
    stakePotAccount: string,
    totalBountyAmount: number,
    bountyAmountPerRound: number,
    status: any,
    currentRound: number,
    availableBalances: number,
    stakeList: any      
}
const getTaskInfo = async (event: Event, payload: GetTaskInfoParam): Promise<TaskState> => {
    const { taskAccountPubKey } = payload;

    const accountInfo = await sdk.k2Connection.getAccountInfo(new PublicKey(taskAccountPubKey));
    const taskData = JSON.parse(accountInfo.data.toString());
    if (!taskData) throw new Error('Task not found');

    const taskInfo = {
        taskName: taskData.task_name,
        taskManager: new PublicKey(taskData.task_manager).toBase58(),
        isWhitelisted: taskData.is_whitelisted,
        isActive: taskData.is_active,
        taskAuditProgram: taskData.task_audit_program,
        stakePotAccount: new PublicKey(taskData.stake_pot_account).toBase58(),
        totalBountyAmount: taskData.total_bounty_amount,
        bountyAmountPerRound: taskData.bounty_amount_per_round,
        status: taskData.status,
        currentRound: taskData.current_round,
        availableBalances: taskData.available_balances,
        stakeList: taskData.stake_list
    };

    return taskInfo;
};

export default mainErrorHandler(getTaskInfo);

