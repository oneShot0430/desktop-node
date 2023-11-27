import React from 'react';

import ChainDeskLogo from 'assets/svgs/ChainDeskLogo.svg';

import { AddonItem } from './AddonItem';

const ADDONS = [
  {
    name: 'ORCA Node Operator',
    description: `Use ORCA to earn more rewards with more complex tasks right from your computer. ORCA (Operational Resource distributed Consensus Automation) is a tool that allows task creators to containerize their app, making development easier and more consistent. Learn more here.

    Koii has vetted this Add-On and worked with the Chained team to develop this tool.`,
    logo: ChainDeskLogo,
  },
];

export function AddOnsList() {
  return (
    <div className="hidden">
      <div className="mb-4 text-2xl font-semibold text-left">Add-ons</div>
      <div className="mb-4">
        Add-ons are programs from our partners that you can download to make
        your node more powerful so you can earn more. All add-ons in this list
        have been vetted by the Koii team.
      </div>
      <div className="pr-4">
        {ADDONS.map((addon) => {
          return (
            <AddonItem
              key={addon.name}
              name={addon.name}
              description={addon.description}
              logo={addon.logo}
            />
          );
        })}
      </div>
    </div>
  );
}
