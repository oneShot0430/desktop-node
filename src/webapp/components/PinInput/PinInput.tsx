import React, { memo, useState } from 'react';
import PinInput from 'react-pin-input';

import HideIconSvg from 'assets/svgs/hide-icon-blue.svg';

import { Button } from '../ui/Button';

type PropsType = Readonly<{
  onChange: (pin: string) => void;
  onComplete?: () => void;
  initialValue?: string | number;
}>;

const PinInputComponent = ({
  onComplete,
  onChange,
  initialValue,
}: PropsType) => {
  const [showPinInput, setShowPinInput] = useState(true);

  return (
    <div className="flex items-center">
      <PinInput
        length={6}
        initialValue={initialValue}
        secret={showPinInput}
        onChange={onChange}
        type="numeric"
        inputMode="number"
        onComplete={onComplete}
        autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
      />
      <Button
        className="bg-finnieTeal-100 rounded-[50%] w-[24px] h-[24px]"
        icon={<HideIconSvg />}
        onClick={() => setShowPinInput(!showPinInput)}
      />
    </div>
  );
};

export default memo(PinInputComponent);
