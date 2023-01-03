import {
  Button,
  ButtonVariant,
  ButtonSize,
  Icon,
} from '@_koii/koii-styleguide';
import Lottie from 'lottie-react';
import React, { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import loadingDotsAnimation from 'assets/animations/loading-dots.json';
import CheckMarkIcon from 'assets/svgs/checkmark-icon-no-borders.svg';
import CloseIcon from 'assets/svgs/close-icons/close-icon-no-borders.svg';
import ShareIcon from 'assets/svgs/share-icon.svg';
import { ErrorType } from 'models';
import { GetTaskNodeInfoResponse } from 'models/api';
import { Tooltip, ErrorMessage } from 'webapp/components';
import { QueryKeys, claimRewards } from 'webapp/services';
import { Theme } from 'webapp/types/common';

interface PropsType {
  value: number;
  displayConfetti?: () => void;
}

export const ClaimRewards = ({ value, displayConfetti }: PropsType) => {
  const [hasClickedClaim, setHasClickedClaim] = useState<boolean>(false);
  const [hasErrorClaimingRewards, setHasErrorClaimingRewards] =
    useState<boolean>(false);

  const handleClickClaim = () => setHasClickedClaim(true);
  const handleGoBack = () => setHasClickedClaim(false);
  const displayErrorTemporarily = () => {
    setHasErrorClaimingRewards(true);
    setTimeout(() => {
      setHasErrorClaimingRewards(false);
    }, 4000);
  };

  const queryClient = useQueryClient();

  const { mutate: claimPendingRewards, isLoading: isClaimingRewards } =
    useMutation(claimRewards, {
      onSuccess: (rewardsNotClaimed) => {
        queryClient.setQueryData(
          [QueryKeys.taskNodeInfo],
          (oldNodeData: GetTaskNodeInfoResponse) => ({
            ...oldNodeData,
            totalKOII:
              oldNodeData.totalKOII +
              oldNodeData.pendingRewards -
              rewardsNotClaimed,
            pendingRewards: rewardsNotClaimed,
          })
        );
        displayConfetti?.();
        if (rewardsNotClaimed) {
          displayErrorTemporarily();
        }
      },
      onError: () => {
        displayErrorTemporarily();
      },
      onSettled: () => {
        setHasClickedClaim(false);
      },
    });

  const buttonsBaseClasses =
    'w-9 h-9 cursor-pointer hover:text-white active:bg-finniePurple active:text-white rounded-full transition transition-300';

  return (
    <div className="w-full ml-0.5 mb-1 flex justify-center mt-auto">
      {hasErrorClaimingRewards ? (
        <ErrorMessage
          error={ErrorType.GENERIC}
          className="text-xs text-finnieRed text-center"
        />
      ) : hasClickedClaim ? (
        isClaimingRewards ? (
          <Lottie
            animationData={loadingDotsAnimation}
            loop
            className="mx-auto h-20"
          />
        ) : (
          <div className="flex justify-center gap-8">
            <Tooltip
              theme={Theme.Light}
              tooltipContent="Go back. Your rewards will not be transferred."
            >
              <Icon
                source={CloseIcon}
                className={`${buttonsBaseClasses} bg-finnieRed hover:bg-finnieRed-500`}
                onClick={handleGoBack}
              />
            </Tooltip>
            <Tooltip
              theme={Theme.Light}
              tooltipContent="Confirm. Rewards will transfer to your account."
            >
              <Icon
                source={CheckMarkIcon}
                className={`${buttonsBaseClasses} bg-finnieEmerald-light hover:bg-finnieEmerald`}
                onClick={() => claimPendingRewards()}
              />
            </Tooltip>
          </div>
        )
      ) : value ? (
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
      ) : (
        <Tooltip
          theme={Theme.Light}
          tooltipContent="Run a few Tasks to earn rewards. Rewards are paid out after a Task is complete."
        >
          <div className="w-full ml-1 -mb-1 flex text-white items-center text-sm">
            Add a Task to Earn <Icon className="w-8 h-8" source={ShareIcon} />
          </div>
        </Tooltip>
      )}
    </div>
  );
};
