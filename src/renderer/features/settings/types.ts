import { SVGProps } from 'react';

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
  MainSettings = 'MainSettings',
  TasksScheduler = 'TasksScheduler',
}

export type SettingsSection = {
  label: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconFocused: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  path: string;
  component: () => JSX.Element;
  disabled?: boolean;
};
