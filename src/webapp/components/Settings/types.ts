export type AccountType = {
  name: string;
  address: string;
  balance: number;
  isDefault?: boolean;
  type: 'main' | 'staking';
};
