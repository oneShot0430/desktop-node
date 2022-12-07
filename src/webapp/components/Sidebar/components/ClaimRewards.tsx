import { Button, ButtonVariant, ButtonSize } from '@_koii/koii-styleguide';
import Lottie from 'lottie-react';
import React, { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import loadingDotsAnimation from 'assets/animations/loading-dots.json';
import CheckMarkIcon from 'assets/svgs/checkmark-icon-no-borders.svg';
import CloseIcon from 'assets/svgs/close-icons/close-icon-no-borders.svg';
import { GetTaskNodeInfoResponse } from 'models/api';
import { Tooltip } from 'webapp/components';
import { QueryKeys, claimRewards } from 'webapp/services';
import { Theme } from 'webapp/types/common';

interface PropsType {
  displayConfetti?: () => void;
}

export const ClaimRewards = ({ displayConfetti }: PropsType) => {
  const [hasClickedClaim, setHasClickedClaim] = useState<boolean>(false);
  const [isClaimingRewards, setIsClaimingRewards] = useState<boolean>(false);

  const handleClickClaim = () => setHasClickedClaim(true);
  const handleGoBack = () => setHasClickedClaim(false);

  const queryClient = useQueryClient();

  const { mutate: claimPendingRewards } = useMutation(claimRewards, {
    onMutate: () => {
      setIsClaimingRewards(true);
    },
    onSuccess: async (partialErrors?: Error[]) => {
      const runSuccessEffects = () => {
        displayConfetti?.();
        setHasClickedClaim(false);
        setIsClaimingRewards(false);
      };
      if (partialErrors) {
        setTimeout(() => {
          runSuccessEffects();
        }, 3000);
        queryClient.invalidateQueries(QueryKeys.taskNodeInfo);
      } else {
        runSuccessEffects();
        queryClient.setQueryData(
          [QueryKeys.taskNodeInfo],
          (oldNodeData: GetTaskNodeInfoResponse) => ({
            ...oldNodeData,
            totalKOII: oldNodeData.totalKOII + oldNodeData.pendingRewards,
            pendingRewards: 0,
          })
        );
      }
    },
    onError: () => {
      setIsClaimingRewards(false);
    },
  });

  const buttonsBaseClasses =
    'w-9 h-9 cursor-pointer hover:text-white active:bg-finniePurple active:text-white rounded-full transition transition-300';

  return (
    <div className="w-full m-2 mt-3">
      {hasClickedClaim ? (
        isClaimingRewards ? (
          <Lottie
            animationData={loadingDotsAnimation}
            loop
            className="mx-auto -mt-4 h-20"
          />
        ) : (
          <div className="flex justify-center gap-8 mt-1 -ml-3">
            <Tooltip
              theme={Theme.Light}
              tooltipContent="Go back. Your rewards will not be transferred."
            >
              <CloseIcon
                className={`${buttonsBaseClasses} bg-finnieRed hover:bg-finnieRed-500`}
                onClick={handleGoBack}
              />
            </Tooltip>
            <Tooltip
              theme={Theme.Light}
              tooltipContent="Confirm. Rewards will transfer to your account."
            >
              <CheckMarkIcon
                className={`${buttonsBaseClasses} bg-finnieEmerald-light hover:bg-finnieEmerald `}
                onClick={() => claimPendingRewards()}
              />
            </Tooltip>
          </div>
        )
      ) : (
        <Tooltip
          theme={Theme.Light}
          tooltipContent="Click here to claim all pending Task rewards."
        >
          <Button
            onClick={handleClickClaim}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.SM}
            label="Claim Rewards"
            labelClassesOverrides="text-sm"
            buttonClassesOverrides="!p-4 !border-white !text-white"
          />
        </Tooltip>
      )}
    </div>
  );
};
