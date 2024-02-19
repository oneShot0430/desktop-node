import {
  Button,
  ButtonVariant,
  ButtonSize,
  Icon,
} from '@_koii/koii-styleguide';
import React from 'react';
import { useQuery } from 'react-query';

import KoiiBrandIconCircled from 'assets/svgs/new/KoiiBrandIconCircled.svg';
import { Tooltip } from 'renderer/components/ui';
import { useTransferFundsModal } from 'renderer/features/common';
import {
  getActiveAccountName,
  getMainAccountPublicKey,
  QueryKeys,
} from 'renderer/services';
import { Theme } from 'renderer/types/common';

import { CountKoii } from '../CountKoii';
import { InfoBox } from '../InfoBox';

type PropsType = {
  availableBalance?: number;
};

export function AvailableBalanceInfoBox({ availableBalance = 0 }: PropsType) {
  // Local variables
  let publicKeyToUse = 'INIT'; // replace with actual value
  let accountNameToUse = 'INIT'; // replace with actual value

  const { data: mainAccount } = useQuery(
    [QueryKeys.MainAccount],
    getMainAccountPublicKey
  );

  const { data: queriedAccountName } = useQuery(
    [QueryKeys.MainAccountName],
    getActiveAccountName
  );

  if (mainAccount && mainAccount !== 'INIT') {
    publicKeyToUse = mainAccount;
  }

  if (queriedAccountName && queriedAccountName !== 'INIT') {
    accountNameToUse = queriedAccountName;
  }

  const { showModal: showTransferModal } = useTransferFundsModal({
    accountName: accountNameToUse,
    walletAddress: publicKeyToUse,
    accountType: 'SYSTEM',
  });
  return (
    <InfoBox className="justify-center p-2 pr-2 h-30 xl:p-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <span className="text-sm text-green-2">Available Balance</span>
          <span className="text-lg">
            <CountKoii value={availableBalance} />
          </span>
        </div>
        {/* TODO: replace with icon from styleguide, when available */}
        <Icon
          source={KoiiBrandIconCircled}
          size={56}
          aria-label="rewards icon"
          data-testid="koii-brand-icon"
        />
      </div>
      <div className="ml-auto mr-auto">
        <Tooltip
          theme={Theme.Light}
          tooltipContent="Click here to transfer KOII to another wallet."
        >
          <Button
            variant={ButtonVariant.Secondary}
            size={ButtonSize.SM}
            label="Transfer KOII"
            buttonClassesOverrides="mt-3 px-6"
            data-testid="transfer-KOII-button"
            onClick={showTransferModal}
          />
        </Tooltip>
      </div>
    </InfoBox>
  );
}
