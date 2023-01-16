export interface TaskVariableData {
  value: string;
  label: string;
}

export type TaskVariables = Record<string, TaskVariableData>;

type TaskId = string;
type TaskVariableName = string;
type DesktopNodeVariableID = string;

export type PairedTaskVariables = Record<
  TaskId,
  Record<TaskVariableName, DesktopNodeVariableID>
>;
