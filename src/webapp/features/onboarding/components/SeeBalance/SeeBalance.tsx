import React, { useState } from 'react';

import { RefreshBalance } from './RefreshBalance';
import { ShowBalance } from './ShowBalance';

export const SeeBalance = () => {
  const [balance, setBalance] = useState(null);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-center h-full">
        {balance ? (
          <ShowBalance balance={balance} />
        ) : (
          <RefreshBalance onBalanceRefresh={(balance) => setBalance(balance)} />
        )}
      </div>
    </div>
  );
};