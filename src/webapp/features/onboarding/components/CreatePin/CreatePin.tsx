import { hash } from 'bcryptjs';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LinesVerticalTeal from 'assets/svgs/onboarding/lines-vertical-teal.svg';
import { Button } from 'webapp/components';
import { PinInput } from 'webapp/components/PinInput';
import { useUserAppConfig } from 'webapp/features/settings';
import { openBrowserWindow } from 'webapp/services';
import { AppRoute } from 'webapp/types/routes';

import { ContentRightWrapper } from '../ContentRightWrapper';

const CreatePin = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const navigate = useNavigate();
  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () =>
      navigate(AppRoute.OnboardingPickKeyCreationMethod),
  });

  const handlePinCreate = async () => {
    // to address before merging: what salt do we wanna use?
    const saltRounds = 10;
    const hashedPin = await hash(pin, saltRounds);
    handleSaveUserAppConfig({
      settings: { pin: hashedPin },
    });
  };

  const pinIsMatching = useMemo(() => pin === pinConfirm, [pin, pinConfirm]);
  const pinsLengtIsMatching = useMemo(
    () => pin.length === 6 && pinConfirm.length === 6,
    [pin, pinConfirm]
  );

  const canLogIn = useCallback(() => {
    if (pinIsMatching && termsAccepted && pin.length === 6) {
      return true;
    }
    return false;
  }, [pin, pinIsMatching, termsAccepted]);

  const diableLogin = !canLogIn();

  const openTermsWindow = () => {
    openBrowserWindow('https://www.koii.network/TOU_June_22_2021.pdf');
  };

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <ContentRightWrapper>
        <div>
          <div className="z-50">
            <div className="mb-5 text-lg">
              Create an{' '}
              <span className="underline underline-offset-4 text-finnieTeal">
                Access PIN
              </span>{' '}
              to secure the Node.
            </div>
            <PinInput onChange={(pin) => setPin(pin)} />
          </div>

          <div>
            <div className="mt-8 mb-5">Confirm your Access PIN.</div>
            <PinInput
              onChange={(pin) => setPinConfirm(pin)}
              showHideButton={false}
            />
            <div className="pt-4 text-xs text-finnieOrange">
              {!pinIsMatching && pinsLengtIsMatching ? (
                <span>Those PINs don’t match. Let’s try again.</span>
              ) : (
                <span>
                  If you forgot your PIN you’ll need to reimport your wallet.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end pt-14">
          <div className="flex items-center relative !inline-block">
            <input
              id="link-checkbox"
              type="checkbox"
              className="w-3 h-3 terms-checkbox"
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label
              htmlFor="link-checkbox"
              className="ml-4 text-sm font-medium "
            >
              I agree with the{' '}
              <a
                href="#"
                className="underline text-finnieTeal"
                onClick={openTermsWindow}
              >
                Terms of Service
              </a>
              .
            </label>
          </div>
          <Button
            disabled={diableLogin}
            label="Log in"
            onClick={handlePinCreate}
            className="bg-finnieGray-light text-finnieBlue w-[240px] mt-6"
          />
        </div>
      </ContentRightWrapper>
      <LinesVerticalTeal className="absolute top-0 right-0 z-10 h-screen" />
    </div>
  );
};

export default CreatePin;
