import { Action } from 'redux';

export type TaskInspectorType = 'TASK_INSPECTOR';

export type Task = {
  name?: string;
  owner?: string;
  totalKOIIBounty?: number;
  nodesParticipating?: number;
  totalKOIIStaked?: number;
  currentTopStake?: number;
  myKOIIStaked?: number;
  state?: string;
  myRewards?: number;
  sourceCode?: string;
};

export interface ITaskInspectorState {
  isShown: boolean;
  task: Task;
}

export interface TaskInspectorAction extends Action<string> {
  payload?: Task;
}
