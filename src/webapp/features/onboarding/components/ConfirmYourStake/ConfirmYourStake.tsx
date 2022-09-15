import React from 'react';
import { useDispatch } from 'react-redux';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { useMainAccountBalance } from 'webapp/features/settings';
import { showModal } from 'webapp/store/actions/modal';

import { SelectedTasksSummary } from './SelectedTasksSummary';

export type TaskToRun = {
  name: string;
  stakedTokensAmount: number;
};

type PropsType = {
  tasksToRun?: TaskToRun[];
};

const ConfirmYourStake = ({ tasksToRun = [] }: PropsType) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: balance, isLoading } = useMainAccountBalance();

  const handleConfirm = () => {
    dispatch(showModal('NOT_ENOUGH_FUNDS'));

    let skip = false;
    if (balance < 0) {
      /**
       * @todo call modal and resolve it with value true/false
       */
      skip = true;
    }

    if (skip) {
      // fulfill
      return;
    } else {
      /**
       * @todo: Fund account and resolve
       */
    }
  };

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="mt-[60px] mb-[50px] text-finnieEmerald-light text-2xl text-center">
          You&apos;re choosing to run:
        </div>

        <SelectedTasksSummary selectedTasks={tasksToRun} />

        <div className="flex justify-center mt-[40px]">
          <div className="flex flex-col items-center justify-center">
            <Button
              className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[220px] h-[38px]"
              label="Confirm"
              onClick={handleConfirm}
            />
            <div className="flex flex-row items-center gap-2 mt-2 text-sm text-finnieEmerald-light">
              <CurrencySvgIcon className="h-[24px]" />
              {`Total balance: ${
                isLoading ? 'Loading balance...' : balance
              } KOII`}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-end pr-8 mt-3">
        <Button
          label="Select more tasks"
          className="bg-transparent text-finnieEmerald-light w-max"
          icon={<AddIconSvg />}
        />
      </div>
    </div>
  );
};

export default ConfirmYourStake;
