import React, { useState } from 'react';

import { RefreshBalance } from './RefreshBalance';
import { ShowBalance } from './ShowBalance';

export function SeeBalance() {
  const [balance, setBalance] = useState<number>();

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-center h-full">
        {
          // eslint-disable-next-line eqeqeq
          balance && balance != 0 ? (
            <ShowBalance balance={balance} />
          ) : (
            <RefreshBalance
              onBalanceRefresh={(balance) => setBalance(balance as number)}
            />
          )
        }
      </div>
    </div>
  );
}
