import {
  Icon,
  CloseLine,
  ChevronArrowLine,
  CopyLine,
  CheckSuccessLine,
  CurrencyMoneyLine,
  WalletLine,
} from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import QRCode from 'qrcode.react';
import React from 'react';
import { useQuery } from 'react-query';

import config from 'config';
import { Button } from 'renderer/components/ui';
import { useClipboard } from 'renderer/features/common/hooks/useClipboard';
import { Modal, ModalContent } from 'renderer/features/modals';
import {
  getMainAccountPublicKey,
  getFaucetStatus,
  openBrowserWindow,
} from 'renderer/services';
import { ValidationStatus } from 'renderer/types';

export interface Props {
  accountPublicKey?: string;
  onGoBack?: () => void;
}

export const AddFunds = create(function AddFunds({
  accountPublicKey = '',
  onGoBack,
}: Props) {
  const modal = useModal();
  const { copyToClipboard, copied: hasCopiedKey } = useClipboard();

  const { data: mainAccountPubKey = '' } = useQuery(
    ['main-account'],
    getMainAccountPublicKey,
    {
      enabled: !accountPublicKey,
    }
  );

  const currentAccountPubKey = accountPublicKey || mainAccountPubKey;

  // give faucetStatus an initial value so we can safely destructure it below
  const { data: faucetStatus = { walletAddress: '' } } = useQuery(
    ['faucet-status', accountPublicKey || mainAccountPubKey],
    () => getFaucetStatus(currentAccountPubKey)
  );

  const { walletAddress: _, ...methods } = faucetStatus;
  const methodsArray = Object.values(methods);
  const methodsClaimed = methodsArray.reduce(
    (accumulator, currentMethodStatus) =>
      currentMethodStatus === ValidationStatus.CLAIMED
        ? accumulator + 1
        : accumulator,
    0
  );
  const hasClaimedAllMethods = methodsClaimed === 4;
  const title = hasClaimedAllMethods
    ? 'Move KOII with Finnie. Copy your address to send your account some love.'
    : methodsClaimed > 0
    ? 'Return to the Faucet to get the rest of your free KOII.'
    : 'Go to the Faucet for some free KOII to get started.';
  const headerClasses = `w-full flex ${
    onGoBack ? 'justify-between' : 'justify-end'
  } py-2 px-4`;

  const closeModal = () => {
    modal.resolve();
    modal.remove();
  };

  const openFaucetAndClose = () => {
    const urlToFaucet = `${config.faucet.FAUCET_URL}?key=${currentAccountPubKey}`;
    openBrowserWindow(urlToFaucet);
    closeModal();
  };

  const copyToClipboardAndClose = () => {
    copyToClipboard(currentAccountPubKey);
    closeModal();
  };

  const openFinnieAndClose = () => {
    const urlToFinnie =
      'https://chrome.google.com/webstore/detail/finnie/cjmkndjhnagcfbpiemnkdpomccnjblmj';
    openBrowserWindow(urlToFinnie);
    closeModal();
  };

  const closeAndGoBack = () => {
    onGoBack?.();
    modal.resolve();
    modal.remove();
  };

  return (
    <Modal>
      <ModalContent className="w-[416px] h-auto text-finnieBlue rounded-xl py-2 pb-4">
        <div className={headerClasses}>
          {onGoBack && (
            <Icon
              source={ChevronArrowLine}
              className="w-6 h-6 cursor-pointer -rotate-90 z-20 mr-auto"
              onClick={closeAndGoBack}
            />
          )}
          <Icon
            source={CloseLine}
            className="w-6 h-6 cursor-pointer z-20"
            onClick={modal.remove}
          />
        </div>

        <div className="flex flex-col items-center w-full h-full px-3 pt-3">
          <div className="mb-3 text-base leading-5 text-center">{title}</div>

          {hasClaimedAllMethods ? (
            <>
              <div className="mt-4 mb-2 text-xs select-text">
                {currentAccountPubKey}
              </div>

              <Button
                onClick={copyToClipboardAndClose}
                label={hasCopiedKey ? 'Copied' : 'Copy'}
                className="text-white bg-purple-4 w-[110px] py-1.5 text-sm mt-3 rounded"
                icon={
                  <Icon
                    source={hasCopiedKey ? CheckSuccessLine : CopyLine}
                    className="h-6 w-6"
                  />
                }
              />

              <Button
                onClick={openFinnieAndClose}
                label="Get the Finnie Wallet"
                className=" bg-transparent w-auto underline text-sm leading-4 py-1.5 text-sm mt-3 rounded"
                icon={<Icon source={WalletLine} className="h-6 w-6" />}
              />
            </>
          ) : (
            <>
              <Button
                onClick={openFaucetAndClose}
                label="Get My Free Tokens"
                className="text-white bg-purple-4 w-[276px] h-[52px] mb-4 rounded-md"
                icon={<Icon source={CurrencyMoneyLine} className="mb-0.5" />}
              />

              <div className="mb-3">
                Scan the QR code or copy the address to send tokens to your node
                account.
              </div>

              <QRCode
                value={currentAccountPubKey}
                renderAs="canvas"
                size={80}
              />
              <div className="mt-4 mb-2 text-xs select-text">
                {currentAccountPubKey}
              </div>
              <Button
                onClick={copyToClipboardAndClose}
                label="copy"
                aria-label="copy"
                className="w-[72px] h-6 rounded-xl text-xs border border-finnieBlue bg-transparent text-finnieBlue-dark"
              />
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
});
