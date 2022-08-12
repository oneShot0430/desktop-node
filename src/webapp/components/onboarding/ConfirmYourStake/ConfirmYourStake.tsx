import React from 'react';
import { useNavigate } from 'react-router-dom';

import CodeIconSvg from 'assets/svgs/code-icon.svg';
import EditIconSvg from 'assets/svgs/edit-icon.svg';
import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/routing/AppRoutes';

const ConfirmYourStake = () => {
  const navigate = useNavigate();

  const handleConfirmYourStake = () => {
    console.log('### handleConfirmYourStake');
    navigate(AppRoute.MyNode);
  };

  /**
   * @todo: just for testing
   */
  const totalBalance = 500;
  const taskFees = 1595;
  const totalKoiiStaked = 235;

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="mt-[60px] mb-[50px] text-finnieEmerald-light text-2xl text-center">
          You’re choosing to run:
        </div>

        <div className="w-full h-full bg-finnieBlue-light-secondary py-[28px] rounded-md">
          <div className="flex flex-row w-full text-lg text-finnieEmerald-light px-[48px]">
            <div className="w-[50%] pl-10">Task</div>
            <div className="w-[50%]">Stake</div>
          </div>

          <div className="my-4">
            {new Array(5).fill(0).map((_, index) => (
              <div
                className="flex flex-row w-full text-md text-finnieEmerald-light px-[48px]"
                key={index}
              >
                <div className="w-[50%]">
                  <div className="flex flex-row items-center gap-2">
                    <CodeIconSvg />
                    <span>Content collectives</span>
                  </div>
                </div>
                <div className="w-[50%]">
                  <div className="flex flex-row gap-2">
                    <Button
                      onClick={() => console.log('implement me')}
                      icon={<EditIconSvg />}
                      className="rounded-[50%] w-[24px] h-[24px] bg-finnieTeal-100"
                    />
                    <div> 25 KOII</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row w-full text-lg text-finnieEmerald-light px-[48px]">
            <div className="w-[50%]">
              <div className="mb-1 font-semibold text-finnieOrange">
                Task Fees
              </div>
              <div className="text-white">{taskFees} KOII</div>
            </div>
            <div className="w-[50%]">
              <div className="mb-2 font-semibold text-finnieEmerald-light">
                Total KOII staked
              </div>
              <div className="text-white">{totalKoiiStaked} KOII</div>
            </div>
          </div>
        </div>

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
