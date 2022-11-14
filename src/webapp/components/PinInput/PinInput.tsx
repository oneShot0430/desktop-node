import React, { memo, useState } from 'react';
import PinInput from 'react-pin-input';

import HideIconSvg from 'assets/svgs/hide-icon-blue.svg';
import ShowIconSvg from 'assets/svgs/show-icon-blue.svg';

import { Button } from '../ui/Button';

type PropsType = Readonly<{
  onChange: (pin: string) => void;
  onComplete?: () => void;
  initialValue?: string | number;
  showHideButton?: boolean;
}>;

const PinInputComponent = ({
  onComplete,
  onChange,
  initialValue,
  showHideButton = true,
}: PropsType) => {
  const [showPinInput, setShowPinInput] = useState(false);

  const ShowOrHideInputIcon = showPinInput ? ShowIconSvg : HideIconSvg;

  return (
    <div className="z-50 flex items-center">
      <PinInput
        length={6}
        initialValue={initialValue}
        secret={!showPinInput}
        onChange={onChange}
        type="numeric"
        inputMode="number"
        onComplete={onComplete}
        autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        ariaLabel="pin-input"
      />
      {showHideButton && (
        <Button
          className="bg-finnieTeal-100 rounded-[50%] w-[24px] h-[24px] cursor-pointer"
          icon={<ShowOrHideInputIcon />}
          onClick={() => setShowPinInput(!showPinInput)}
        />
      )}
    </div>
  );
};

export default memo(PinInputComponent);
