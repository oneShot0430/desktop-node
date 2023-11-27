import React from 'react';

import { SectionHeader } from '../SectionHeader';
import { Spacer } from '../Spacer';

import { BugReport } from './BugReport';
import { DiscrodButton } from './DiscordButton';
import { StartNodeTourButton } from './StartNodeTourButton';
import { WatchVideoButton } from './WatchVideoButton';

export function Help() {
  return (
    <div className="overflow-y-auto text-white">
      <SectionHeader title="Need Help?" />

      <div className="mb-2 text-lg font-semibold">
        Something’s not working properly?
      </div>
      <p className="text-sm">
        If you notice something broken or suspicious let us know immediately.
      </p>
      <BugReport />
      <Spacer showSeparator />

      <div className="mb-2 text-lg font-semibold ">Contact Us</div>
      <p className="text-sm">
        To get in touch with someone from our team, please head to our Discord
        server and open a support ticket.
      </p>
      <DiscrodButton />
      <Spacer showSeparator />

      {/** TODO: enable when marketing team will prepare resources */}
      <div className="hidden">
        <div className="mb-2 text-lg font-semibold">
          Not sure where to start?{' '}
        </div>
        <p className="text-sm">
          Check this basic tutorials on some functionalities of the node to get
          you started on the basics
        </p>
        <div className="flex gap-4">
          <StartNodeTourButton />
          <WatchVideoButton />
        </div>
      </div>
    </div>
  );
}
