import React from 'react';

type BalanceInfoProps = {
  logo: React.ElementType;
  name: string;
  value: number;
};

const BalanceInfo = ({ logo: Logo, name, value }: BalanceInfoProps): JSX.Element => {
  return (
    <div className="h-8 w-72 flex pl-2 pr-1 justify-between items-center finnie-border-teal mb-1.5">
      <Logo className="w-5.25" />
      <div className="flex-grow ml-2.5 tracking-finnieSpacing-tight">{name}</div>
      <div className="tracking-finnieSpacing-tight text-finnieTeal">{value}</div>
    </div>
  );
};

export default BalanceInfo;
