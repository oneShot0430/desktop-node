import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LinesVerticalTeal from 'assets/svgs/onboarding/lines-vertical-teal.svg';
import { PinInput } from 'webapp/components/PinInput';
import { AppRoute } from 'webapp/routing/AppRoutes';

import { Button } from '../../ui/Button';

const CreatePin = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const navigate = useNavigate();

  const handlePinCreate = () => {
    console.log('create pin');
    // TODO: save pin to levelDB storage
    navigate(AppRoute.OnboardingCreateOrImportKey);
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

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="relative z-50">
        <div className="pl-24">
          <div className="mt-[160px] z-50">
            <div className="mb-5">
              Create an <span>Access PIN</span> to secure the Node.
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

        <div className="flex flex-col items-center pt-14">
          <div className="flex items-center">
            <input
              id="link-checkbox"
              type="checkbox"
              className="w-4 h-4 bg-transparent focus:ring-finnieTeal focus:ring-2 border-red"
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label
              htmlFor="link-checkbox"
              className="ml-2 text-sm font-medium "
            >
              I agree with the{' '}
              <a href="#" className="hover:underline text-finnieTeal">
                Terms of Service
              </a>
              .
            </label>
          </div>
          <Button
            disabled={diableLogin}
            label="Log in"
            onClick={handlePinCreate}
            className="bg-finnieGray-light text-finnieBlue-dark w-[240px] mt-6"
          />
        </div>
      </div>
      <LinesVerticalTeal className="absolute top-0 right-0 z-10" />
    </div>
  );
};

export default CreatePin;
