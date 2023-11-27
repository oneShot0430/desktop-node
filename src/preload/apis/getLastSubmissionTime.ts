import config from 'config';
import { TaskData } from 'models';
import sendMessage from 'preload/sendMessage';

type GetTaskLastSubmissionTimeParams = {
  task: TaskData;
  stakingPublicKey: string;
};

export default (payload: GetTaskLastSubmissionTimeParams): Promise<number> =>
  sendMessage(config.endpoints.GET_TASK_LAST_SUBMISSION_TIME, payload);
