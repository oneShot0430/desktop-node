import React from 'react';

import LinesVerticalTeal from 'assets/svgs/onboarding/lines-vertical-teal.svg';
import PinInput from 'webapp/components/PinInput/PinInput';

import { Button } from '../../ui/Button';

const CreatePin = () => {
  return (
    <div className="relative h-full pl-24 overflow-hidden bg-finnieBlue-dark-secondary">
      <LinesVerticalTeal className="absolute right-0" />
      <div className="mt-[160px]">
        <div className="mb-5">
          Create an <span>Access PIN</span> to secure the Node.
        </div>
        <PinInput onChange={(e) => console.log(e)} />
      </div>

      <div>
        <div className="mt-8 mb-5">Confirm your Access PIN.</div>
        <PinInput onChange={(e) => console.log(e)} />
        <div>If you forgot your PIN you’ll need to reimport your wallet.</div>
      </div>

      <div>
        <div>
          <input type="checkgbox" />
          <span>I agree with the Terms of Service</span>
        </div>
        <Button label="Log in" />
      </div>
    </div>
  );
};

export default CreatePin;
