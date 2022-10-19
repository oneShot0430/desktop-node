import { create, useModal } from '@ebay/nice-modal-react';
import QRCode from 'qrcode.react';
import React from 'react';
import { useQuery } from 'react-query';

import CurrencyIconSvg from 'assets/svgs/onboarding/currency-icon.svg';
import CloseIconComponent from 'svgs/close-icons/close-icon-blue.svg';
import { Button } from 'webapp/components';
import { useClipboard } from 'webapp/features/common';
import { Modal, ModalContent } from 'webapp/features/modals';
import { getMainAccountPublicKey } from 'webapp/services';

export const AddFunds = create(function AddFunds() {
  const modal = useModal();
  const { copyToClipboard } = useClipboard();
  const { data: mainAccountPubKey } = useQuery(
    ['main-account'],
    getMainAccountPublicKey
  );

  const openFaucet = () => {
    window.open(`https://faucet.koii.live?key=${mainAccountPubKey}`, '_blank');
  };

  return (
    <Modal>
      <ModalContent className="w-[416px] h-[416px] text-finnieBlue rounded-xl pt-2">
        <div className="flex justify-end pr-2">
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
          <div className="mb-3 text-lg leading-8 text-center">
            Go to the Faucet for some free KOII to get started.
          </div>

          <Button
            onClick={openFaucet}
            label={'Get My Free Tokens'}
            className="text-white bg-purple-4 w-[276px] h-[52px] mb-14 rounded-md"
            icon={
              <span className="w-[14px] h-[14px]">
                <CurrencyIconSvg className="h-[100%]" />
              </span>
            }
          />

          <div className="mb-3">Or send KOII directly to this account.</div>

          <QRCode value="https://reactjs.org/" renderAs="canvas" size={80} />

          <div className="mt-4 mb-2 text-xs select-text">
            {mainAccountPubKey}
          </div>

          <Button
            onClick={() => {
              copyToClipboard(mainAccountPubKey);
              modal.resolve();
              modal.remove();
            }}
            label="copy"
            className="w-[72px] h-[24px] rounded-xl text-xs border border-finnieBlue bg-transparent text-finnieBlue-dark"
          />
        </div>
      </ModalContent>
    </Modal>
  );
});
