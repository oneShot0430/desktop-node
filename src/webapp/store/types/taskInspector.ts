import { Action } from 'redux';

export type TaskInspectorType = 'TASK_INSPECTOR';

export type TaskInfo = {
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

export type TaskInspectorPayload = {
  type: 'TASK_INSPECTOR';
  taskInfo: TaskInfo;
};

export interface ITaskInspectorState {
  isShown: boolean;
  taskInspectorData: TaskInspectorPayload;
}

export interface TaskInspectorAction extends Action<string> {
  taskInspectorPayload?: TaskInspectorPayload;
}
