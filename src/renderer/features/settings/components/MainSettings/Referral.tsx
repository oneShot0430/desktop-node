import { CheckSuccessLine, CopyLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';
import { useQuery } from 'react-query';

import { LoadingSpinner, Tooltip } from 'renderer/components/ui';
import { useClipboard } from 'renderer/features/common';
import { QueryKeys, getReferralCode } from 'renderer/services';

import { useMainAccount, useUserAppConfig } from '../../hooks';

export function Referral() {
  const { data: mainAccountPubKey = '' } = useMainAccount();

  const { data: referralCode = '' } = useQuery(
    [QueryKeys.ReferralCode, mainAccountPubKey],
    () => getReferralCode(mainAccountPubKey)
  );

  const { userConfig, handleSaveUserAppConfig } = useUserAppConfig({});

  const { copyToClipboard, copied } = useClipboard();

  const copyReferralCode = () => {
    copyToClipboard(referralCode);
    handleSaveUserAppConfig({ settings: { hasCopiedReferralCode: true } });
  };

  const shouldSeeTheNewTag = userConfig?.hasCopiedReferralCode === false;

  return (
    <div className="font-light">
      <div className="flex gap-3">
        <p className="font-semibold mb-4">Referral Code</p>
        {shouldSeeTheNewTag && <span className="text-finnieOrange">NEW!</span>}
      </div>
      <p className="mb-2">
        Get 5 extra tokens for each friend who joins the network.
      </p>
      <p>
        With this code, they’ll get 5 bonus tokens from the faucet after
        verifying Twitter and Discord accounts.
      </p>
      <p>
        After they run a node for 7 days, you’ll get 5 and they’ll get 5 more.
      </p>
      <div className="flex items-center mt-5 gap-6">
        {referralCode ? (
          <>
            <div className="px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary w-fit">
              {referralCode}
            </div>

            <Tooltip tooltipContent={copied ? 'Copied' : 'Copy'}>
              <Icon
                onClick={copyReferralCode}
                source={copied ? CheckSuccessLine : CopyLine}
                className={`text-white cursor-pointer ${
                  copied ? 'h-5.5 w-5.5' : 'h-5 w-5'
                }`}
              />
            </Tooltip>
          </>
        ) : (
          <LoadingSpinner className="ml-20 h-9" />
        )}
      </div>
    </div>
  );
}
