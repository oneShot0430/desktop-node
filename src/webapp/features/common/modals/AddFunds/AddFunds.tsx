import { create, useModal } from '@ebay/nice-modal-react';
import QRCode from 'qrcode.react';
import React from 'react';
import { useQuery } from 'react-query';

import CurrencyIconSvg from 'assets/svgs/onboarding/currency-icon.svg';
import config from 'config';
import BackIcon from 'svgs/back-icon.svg';
import CloseIconComponent from 'svgs/close-icons/close-icon-blue.svg';
import { Button } from 'webapp/components';
import { useClipboard } from 'webapp/features/common';
import { Modal, ModalContent } from 'webapp/features/modals';
import {
  getMainAccountPublicKey,
  getFaucetStatus,
  openBrowserWindow,
} from 'webapp/services';
import { ValidationStatus } from 'webapp/types';

interface Props {
  onGoBack: () => void;
}

export const AddFunds = create(function AddFunds({ onGoBack }: Props) {
  const modal = useModal();
  const { copyToClipboard } = useClipboard();
  const { data: mainAccountPubKey } = useQuery(
    ['main-account'],
    getMainAccountPublicKey
  );
  // give faucetStatus an initial value so we can safely destructure it below
  const { data: faucetStatus = { walletAddress: '' } } = useQuery(
    ['faucet-status', mainAccountPubKey],
    () => getFaucetStatus(mainAccountPubKey)
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

  const closeModal = () => {
    modal.resolve();
    modal.remove();
  };

  const openFaucetAndClose = () => {
    openBrowserWindow(config.faucet.FAUCET_URL + mainAccountPubKey);
    closeModal();
  };

  const copyToClipboardAndClose = () => {
    copyToClipboard(mainAccountPubKey);
    closeModal();
  };

  const closeAndGoBack = () => {
    onGoBack?.();
    modal.resolve();
    modal.remove();
  };

  return (
    <Modal>
      <ModalContent className="w-[416px] h-[416px] text-finnieBlue rounded-xl pt-2">
        <div
          className={`w-full flex ${
            onGoBack ? 'justify-between' : 'justify-end'
          } p-2`}
        >
          {onGoBack && (
            <BackIcon
              onClick={closeAndGoBack}
              className="w-[18px] h-[18px] cursor-pointer z-20"
            />
          )}
          <CloseIconComponent
            data-testid="close-modal-button"
            onClick={() => {
              modal.resolve();
              modal.remove();
            }}
            className="w-[18px] h-[18px] cursor-pointer z-20"
          />
        </div>

        <div className="flex flex-col items-center w-full h-full">
          <div className="mb-3 text-lg leading-8 text-center">{title}</div>

          {hasClaimedAllMethods ? (
            <QRCode value={mainAccountPubKey} renderAs="canvas" size={240} />
          ) : (
            <>
              <Button
                onClick={openFaucetAndClose}
                label={'Get My Free Tokens'}
                className="text-white bg-purple-4 w-[276px] h-[52px] mb-14 rounded-md"
                icon={<CurrencyIconSvg className="scale-50 mb-0.5" />}
              />

              <div className="mb-3">Or send KOII directly to this account.</div>

              <QRCode value={mainAccountPubKey} renderAs="canvas" size={80} />
            </>
          )}

          <div className="mt-4 mb-2 text-xs select-text">
            {mainAccountPubKey}
          </div>

          <Button
            onClick={copyToClipboardAndClose}
            label="copy"
            className="w-[72px] h-[24px] rounded-xl text-xs border border-finnieBlue bg-transparent text-finnieBlue-dark"
          />
        </div>
      </ModalContent>
    </Modal>
  );
});
