export interface TaskVariableData {
  value: string;
  label: string;
}

export type TaskVariables = Record<string, TaskVariableData>;
