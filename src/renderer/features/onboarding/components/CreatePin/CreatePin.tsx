import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LinesVerticalTeal from 'assets/svgs/onboarding/lines-vertical-teal.svg';
import { PinInput } from 'renderer/components/PinInput';
import { Button, Tooltip } from 'renderer/components/ui';
import { usePinUtils } from 'renderer/features/security';
import { useUserAppConfig } from 'renderer/features/settings/hooks';
import { openBrowserWindow } from 'renderer/services';
import { Theme } from 'renderer/types/common';
import { AppRoute } from 'renderer/types/routes';

import { useOnboardingContext } from '../../context/onboarding-context';
import { ContentRightWrapper } from '../ContentRightWrapper';

function CreatePin() {
  const { encryptPin } = usePinUtils();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [focus, setFocus] = useState(true);
  const navigate = useNavigate();
  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () =>
      navigate(AppRoute.OnboardingPickKeyCreationMethod),
  });

  const { setAppPin } = useOnboardingContext();

  const handlePinCreate = async () => {
    const hashedPin = await encryptPin(pin);

    /**
     * sets raw pin value to context
     */
    console.log('@@@ sets new pin', pin);
    setAppPin(pin);

    console.log('@@@ sets new pin in settings', hashedPin);
    handleSaveUserAppConfig({
      settings: {
        /**
         * Saves **hashed** pin value to user config
         */
        pin: hashedPin,
        hasCopiedReferralCode: false,
        hasStartedEmergencyMigration: true,
        hasFinishedEmergencyMigration: true,
      },
    });
  };

  const pinIsMatching = useMemo(() => pin === pinConfirm, [pin, pinConfirm]);
  const pinsLengthIsMatching = useMemo(
    () => pin.length === 6 && pinConfirm.length === 6,
    [pin, pinConfirm]
  );

  const canLogIn = useCallback(() => {
    if (pinIsMatching && termsAccepted && pin.length === 6) {
      return true;
    }
    return false;
  }, [pin, pinIsMatching, termsAccepted]);

  const disableLogin = !canLogIn();

  const openTermsWindow = () => {
    openBrowserWindow('https://www.koii.network/TOU_June_22_2021.pdf');
  };

  const handlePinSubmit = (pin: string) => {
    setFocus(false);
    setPin(pin);
  };

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <ContentRightWrapper>
        <div>
          <div className="z-50">
            <div className="mb-5 text-lg">
              Create an{' '}
              <Tooltip
                placement="top-right"
                theme={Theme.Light}
                tooltipContent={
                  <p className="max-w-[450px] xl:max-w-xl">
                    You&apos;ll use this PIN to unlock your node. If you forget
                    it, you can always reinstall your account using a secret
                    phrase
                  </p>
                }
              >
                <span className="underline underline-offset-4 text-finnieTeal">
                  Access PIN
                </span>
              </Tooltip>{' '}
              to secure the Node.
            </div>
            <PinInput focus onComplete={handlePinSubmit} />
          </div>

          <div>
            <div className="mt-8 mb-5">Confirm your Access PIN.</div>
            <PinInput
              focus={!pinConfirm && !focus}
              onChange={(pin) => setPinConfirm(pin)}
              key={pin}
            />
            <div className="pt-4 text-xs text-finnieOrange">
              {!pinIsMatching && pinsLengthIsMatching ? (
                <span>
                  Oops! These PINs don’t match. Double check it and try again.
                </span>
              ) : (
                <span>
                  If you forgot your PIN you’ll need to reimport your wallet.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start pt-14">
          <div className="relative items-center inline-block">
            <input
              id="link-checkbox"
              type="checkbox"
              className="w-3 h-3 terms-checkbox"
              onKeyDown={(e) =>
                e.key === 'Enter' && setTermsAccepted(!termsAccepted)
              }
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <label
              htmlFor="link-checkbox"
              className="ml-4 text-sm font-medium "
            >
              I agree with the{' '}
              <button
                className="underline text-finnieTeal"
                onClick={openTermsWindow}
              >
                Terms of Service
              </button>
              .
            </label>
          </div>
          <Button
            disabled={disableLogin}
            label="Log in"
            onClick={handlePinCreate}
            className="mt-6 mr-3 bg-finnieGray-light text-finnieBlue w-60"
          />
        </div>
      </ContentRightWrapper>
      <LinesVerticalTeal className="absolute top-0 -right-[22.5%] 2xl:-right-[37%] z-10 h-screen" />
    </div>
  );
}

export default CreatePin;
