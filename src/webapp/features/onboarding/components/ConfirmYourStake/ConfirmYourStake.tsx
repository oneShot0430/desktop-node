import React from 'react';
import { useNavigate } from 'react-router-dom';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { useMainAccountBalance } from 'webapp/features/settings';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { saveUserConfig } from 'webapp/services';

import { SelectedTasksSummary } from './SelectedTasksSummary';

export type TaskToRun = {
  name: string;
  stakedTokensAmount: number;
};

type PropsType = {
  tasksToRun?: TaskToRun[];
};

const ConfirmYourStake = ({ tasksToRun = [] }: PropsType) => {
  const navigate = useNavigate();
  const totalBalance = useMainAccountBalance();

  const handleConfirmYourStake = () => {
    console.log('### handleConfirmYourStake');
    saveUserConfig({ settings: { onboardingCompleted: true } })
      .then(() => {
        navigate(AppRoute.MyNode);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="mt-[60px] mb-[50px] text-finnieEmerald-light text-2xl text-center">
          You’re choosing to run:
        </div>

        <SelectedTasksSummary selectedTasks={tasksToRun} />

        <div className="flex flex-row justify-start mt-3">
          <Button
            label="Customize my tasks"
            className="bg-transparent text-finnieEmerald-light w-max"
            icon={<AddIconSvg />}
          />
        </div>

        <div className="flex justify-center mt-[40px]">
          <div className="flex flex-col items-center justify-center">
            <Button
              className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[220px] h-[38px]"
              label="Confirm"
              onClick={handleConfirmYourStake}
            />
            <div className="flex flex-row items-center gap-2 mt-2 text-sm text-finnieEmerald-light">
              <CurrencySvgIcon className="h-[24px]" />
              {`Total balance: ${totalBalance} KOII`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmYourStake;
