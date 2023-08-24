import { useRef, useState, useEffect } from 'react';

const REWARD_EARNED_BANNER_DURATION = 5000;

export const usePreviousRewards = (pendingRewards?: number) => {
  const previousPendingRewardsRef = useRef<number | undefined>(undefined);
  const [newRewardsAvailable, setNewRewardsAvailable] = useState(false);

  useEffect(() => {
    if (
      previousPendingRewardsRef.current &&
      previousPendingRewardsRef.current !== pendingRewards &&
      pendingRewards !== 0
    ) {
      setNewRewardsAvailable(true);
      setTimeout(() => {
        setNewRewardsAvailable(false);
      }, REWARD_EARNED_BANNER_DURATION);
    }
    previousPendingRewardsRef.current = pendingRewards;
  }, [pendingRewards]);

  return { newRewardsAvailable };
};
