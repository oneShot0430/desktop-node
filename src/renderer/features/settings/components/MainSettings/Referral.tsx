import { CheckSuccessLine, CopyLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';
import { useQuery } from 'react-query';

import { LoadingSpinner, Tooltip, Button } from 'renderer/components/ui';
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

  const { copyToClipboard: copyCode, copied: codeCopied } = useClipboard();
  const { copyToClipboard: copyLink, copied: linkCopied } = useClipboard();

  const copyReferralCode = () => {
    copyCode(referralCode);
    handleSaveUserAppConfig({ settings: { hasCopiedReferralCode: true } });
  };

  const copyReferralLink = () => {
    copyLink(`https://www.koii.network/node?promo=${referralCode}`);
    handleSaveUserAppConfig({ settings: { hasCopiedReferralCode: true } });
  };

  const shouldSeeTheNewTag = userConfig?.hasCopiedReferralCode === false;

  return (
    <div className="font-light">
      <div className="flex gap-3">
        <p className="font-semibold mb-4">Referral Link</p>
        {shouldSeeTheNewTag && <span className="text-finnieOrange">NEW!</span>}
      </div>
      <p className="mb-2">
        Share your referral link and get 5 extra tokens for each friend who
        joins the network.
      </p>
      <p>
        With this link, they’ll get 5 bonus tokens from the faucet after
        verifying Twitter and Discord accounts. After they run a node for 7
        days, you’ll get 5 and they’ll get 5 more.
      </p>
      <div className="flex items-center mt-5 gap-6">
        {referralCode ? (
          <>
            <Tooltip
              tooltipContent={linkCopied ? 'Referral link copied!' : 'Copy'}
            >
              <Button
                label="Copy My Referral Link"
                icon={
                  <Icon
                    onClick={copyReferralLink}
                    source={linkCopied ? CheckSuccessLine : CopyLine}
                    className={`text-blue cursor-pointer ${
                      linkCopied ? 'h-5.5 w-5.5' : 'h-5 w-5'
                    }`}
                  />
                }
                onClick={copyReferralLink}
                className="font-semibold bg-white text-finnieBlue-light text-[14px] leading-[14px] min-w-[250px] h-9 self-end"
              />
            </Tooltip>
            <Tooltip tooltipContent="This code is for the faucet. If your friend uses your link, this code will be added to the automatically.">
              <div className="px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary w-fit">
                {referralCode}
              </div>
            </Tooltip>
            <Tooltip tooltipContent={codeCopied ? 'Copied' : 'Copy'}>
              <Icon
                onClick={copyReferralCode}
                source={codeCopied ? CheckSuccessLine : CopyLine}
                className={`text-white cursor-pointer ${
                  codeCopied ? 'h-5.5 w-5.5' : 'h-5 w-5'
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
