export type AccountType = {
  name: string;
  address: string;
  balance: number;
  isDefault?: boolean;
  type: 'main' | 'staking';
};

export enum Tab {
  AccountsTable = 'AccountsTable',
  TaskSettings = 'TaskSettings',
  NodeLogs = 'NodeLogs',
}
