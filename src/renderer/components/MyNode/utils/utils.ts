import { Task } from 'renderer/types';

type GetTaskMessageParams = {
  taskIsDelistedAndStopped: boolean;
  task: Task;
  isBountyEmpty: boolean;
  myStakeInKoii: number;
  isRunning: boolean;
  minStake: number;
  isPrivate: boolean;
};

export function getTaskMessage({
  taskIsDelistedAndStopped,
  task,
  isBountyEmpty,
  myStakeInKoii,
  isRunning,
  minStake,
  isPrivate,
}: GetTaskMessageParams): string {
  if (taskIsDelistedAndStopped && !isPrivate) {
    return "This task has been delisted, but don't worry! Your tokens are safe and will be ready to unstake after 3 rounds.";
  } else if (!task.isWhitelisted && !isPrivate) {
    return "This task has been delisted, but don't worry! Your tokens are safe. Pause the task and the tokens will be ready to unstake after 3 rounds.";
  } else if (isBountyEmpty) {
    return 'This task is inactive because the bounty is empty. The creator needs to refill the bounty before you can run it again.';
  } else if (myStakeInKoii > 0) {
    return `${isRunning ? 'Stop' : 'Start'} task`;
  } else {
    return `You need to stake at least ${minStake} KOII on this task to run it.`;
  }
}
