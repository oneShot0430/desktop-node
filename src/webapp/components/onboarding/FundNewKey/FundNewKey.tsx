import React from 'react';

import YellowLinesTop from 'assets/svgs/onboarding/key-import-lines-top.svg';
import TealLinesBottom from 'assets/svgs/onboarding/key-import-teal-lines-bot.svg';
import RewardsSvg from 'assets/svgs/onboarding/rewards-icon.svg';
import SeedPhraseSvg from 'assets/svgs/onboarding/seed-phrase-icon.svg';

const FundNewKey = () => {
  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="text-lg mt-[140px] flex flex-col px-[100px]">
        <p className="mb-4">
          To make sure everyone is playing fairly, each node must
          <br /> stake tokens as collateral.
        </p>
        <p>Create a new key or import an existing Koii key.</p>
      </div>

      <div className="mt-16">
        <div className="flex flex-row items-center justify-center gap-16">
          <div className="flex flex-col items-center">
            <div className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4">
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <RewardsSvg />
              </div>
            </div>
            Create a New Key
          </div>

          <div className="flex flex-col items-center">
            <div className="w-[180px] h-[180px] p-2 border-2 border-dashed border-finnieTeal rounded-full mb-4">
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <SeedPhraseSvg />
              </div>
            </div>
            Import Key
          </div>
        </div>
      </div>
      <YellowLinesTop className="absolute top-0 right-0" />
      <TealLinesBottom className="absolute bottom-0 left-[-180px]" />
    </div>
  );
};

export default FundNewKey;
