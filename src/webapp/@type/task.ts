export type Task = {
  name: string;
  owner: string;
  txId: string;

  bounty: number;
  nodes: number;
  topStake: number;
  stake: number;
  minStake: number;
  status: 'running' | 'paused';
  rewardEarned: number;
  myStake: number;
  state: 'in progress' | 'accepted' | 'waiting to verify';
};
