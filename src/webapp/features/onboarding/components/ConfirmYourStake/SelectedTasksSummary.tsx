import React, { useMemo } from 'react';

import CodeIconSvg from 'assets/svgs/code-icon.svg';
import EditIconSvg from 'assets/svgs/edit-icon.svg';
import { Button } from 'webapp/components';

type PropsType = {
  selectedTasks: { name: string; stakedTokensAmount: number }[];
};

export const SelectedTasksSummary = ({ selectedTasks }: PropsType) => {
  const listEmpty = selectedTasks.length === 0;
  /**
   * @todo: calculate fees
   */
  const taskFees = 0;
  const totalKoiiStaked = useMemo(
    () =>
      selectedTasks.reduce((acc, item) => {
        return acc + item.stakedTokensAmount;
      }, 0),
    []
  );

  // if (listEmpty) {
  //   return null;
  // }

  return (
    <div className="w-full h-full bg-finnieBlue-light-secondary py-[28px] rounded-md min-h-[330px]">
      <div className="flex flex-row w-full text-lg text-finnieEmerald-light px-[48px]">
        <div className="w-[50%] pl-10">Task</div>
        <div className="w-[50%]">Stake</div>
      </div>

      <div className="my-4 min-h-[160px]">
        {listEmpty ? (
          <div className="flex flex-col items-center justify-center pt-[60px]">
            You didn&apos;t select any tasks to run.
          </div>
        ) : (
          selectedTasks.map(({ name, stakedTokensAmount }) => (
            <div
              className="flex flex-row w-full text-md text-finnieEmerald-light px-[48px]"
              key={name}
            >
              <div className="w-[50%]">
                <div className="flex flex-row items-center gap-2">
                  <CodeIconSvg />
                  <span>{name}</span>
                </div>
              </div>
              <div className="w-[50%]">
                <div className="flex flex-row gap-2">
                  <Button
                    onClick={() => console.log('implement me')}
                    icon={<EditIconSvg />}
                    className="rounded-[50%] w-[24px] h-[24px] bg-finnieTeal-100"
                  />
                  <div>{stakedTokensAmount} KOII</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-row w-full text-lg text-finnieEmerald-light px-[48px]">
        <div className="w-[50%]">
          <div className="mb-1 font-semibold text-finnieOrange">Task Fees</div>
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
  );
};
