import { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNotificationsContext } from 'renderer/features/notifications/context/notifications-context';
import {
  AppNotification,
  NotificationPlacement,
} from 'renderer/features/notifications/types';
import { getStakingAccountPublicKey, QueryKeys } from 'renderer/services';
import { getKoiiFromRoe } from 'utils';

import { useAccountBalance } from './useAccountBalance';

const CRITICAL_STAKING_ACCOUNT_BALANCE = 0.5;
const LOW_STAKING_ACCOUNT_BALANCE = 5;

export const useLowStakingAccountBalanceWarnings = () => {
  const { addNotification } = useNotificationsContext();

  const { data: stakingPublicKey } = useQuery(
    [QueryKeys.StakingAccount],
    getStakingAccountPublicKey
  );

  const { accountBalance: stakingAccountBalance } =
    useAccountBalance(stakingPublicKey);

  const [previousBalance, setPreviousBalance] = useState<number | null>(null);

  const stakingAccountBalanceInKoii = useMemo(
    () => stakingAccountBalance && getKoiiFromRoe(stakingAccountBalance),
    [stakingAccountBalance]
  );

  useEffect(() => {
    if (!stakingAccountBalanceInKoii) return;

    if (stakingAccountBalanceInKoii < CRITICAL_STAKING_ACCOUNT_BALANCE) {
      addNotification(
        AppNotification.LowStakingAccountBalanceSevere,
        AppNotification.LowStakingAccountBalanceSevere,
        NotificationPlacement.TopBar
      );
    } else if (
      stakingAccountBalanceInKoii <= LOW_STAKING_ACCOUNT_BALANCE &&
      (previousBalance === null ||
        previousBalance - stakingAccountBalanceInKoii >= 1)
    ) {
      addNotification(
        AppNotification.LowStakingAccountBalance,
        AppNotification.LowStakingAccountBalance,
        NotificationPlacement.TopBar
      );
      setPreviousBalance(stakingAccountBalanceInKoii);
    }
  }, [stakingAccountBalanceInKoii, addNotification, previousBalance]);
};
