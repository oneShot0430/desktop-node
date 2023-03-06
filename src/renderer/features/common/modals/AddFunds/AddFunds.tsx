import {
  Icon,
  CurrencyMoneyLine,
  CloseLine,
  ChevronArrowLine,
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

interface PropsType {
  onGoBack?: () => void;
}

export const AddFunds = create(function AddFunds({ onGoBack }: PropsType) {
  const modal = useModal();
  const { copyToClipboard } = useClipboard();
  const { data: mainAccountPubKey } = useQuery(
    ['main-account'],
    getMainAccountPublicKey
  );
  // give faucetStatus an initial value so we can safely destructure it below
  const { data: faucetStatus = { walletAddress: '' } } = useQuery(
    ['faucet-status', mainAccountPubKey],
    () => getFaucetStatus(mainAccountPubKey as string)
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
    ? 'Scan the QR code or copy the address to send tokens to your node account.'
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
    const urlToFaucet = `${config.faucet.FAUCET_URL}?key=${mainAccountPubKey}`;
    openBrowserWindow(urlToFaucet);
    closeModal();
  };

  const copyToClipboardAndClose = () => {
    copyToClipboard(mainAccountPubKey as string);
    closeModal();
  };

  const closeAndGoBack = () => {
    onGoBack?.();
    modal.resolve();
    modal.remove();
  };

  return (
    <Modal>
      <ModalContent className="w-[416px] h-[430px] text-finnieBlue rounded-xl pt-2">
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

        <div className="flex flex-col items-center w-full h-full">
          <div className="mb-3 text-lg leading-8 text-center">{title}</div>

          {hasClaimedAllMethods ? (
            <QRCode
              value={mainAccountPubKey as string}
              renderAs="canvas"
              size={240}
            />
          ) : (
            <>
              <Button
                onClick={openFaucetAndClose}
                label="Get My Free Tokens"
                className="text-white bg-purple-4 w-[276px] h-[52px] mb-14 rounded-md"
                icon={<Icon source={CurrencyMoneyLine} className="mb-0.5" />}
              />

              <div className="mb-3">Or send KOII directly to this account.</div>

              <QRCode
                value={mainAccountPubKey as string}
                renderAs="canvas"
                size={80}
              />
            </>
          )}

          <div className="mt-4 mb-2 text-xs select-text">
            {mainAccountPubKey}
          </div>

          <Button
            onClick={copyToClipboardAndClose}
            label="copy"
            className="w-[72px] h-6 rounded-xl text-xs border border-finnieBlue bg-transparent text-finnieBlue-dark"
          />
        </div>
      </ModalContent>
    </Modal>
  );
});