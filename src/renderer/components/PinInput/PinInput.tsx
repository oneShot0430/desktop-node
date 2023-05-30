import { HideEyeLine, ViewShowLine, Icon } from '@_koii/koii-styleguide';
import React, { memo, useState } from 'react';
import PinInput from 'react-pin-input';

import { Button } from '../ui/Button';

type PropsType = Readonly<{
  onChange?: (pin: string) => void;
  onComplete?: (pin: string) => void;
  initialValue?: string | number;
  showHideButton?: boolean;
  showHideIconSize?: number;
  focus?: boolean;
  className?: string;
}>;

function PinInputComponent({
  onComplete,
  onChange,
  initialValue,
  showHideButton = true,
  focus = false,
  showHideIconSize = 20,
}: PropsType) {
  const [showPinInput, setShowPinInput] = useState(false);

  const ShowOrHideInputIcon = showPinInput ? ViewShowLine : HideEyeLine;

  return (
    <div className="z-50 flex items-center">
      <PinInput
        focus={focus}
        length={6}
        initialValue={initialValue}
        secret={!showPinInput}
        onChange={onChange}
        type="numeric"
        inputMode="number"
        onComplete={onComplete}
        autoSelect
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        ariaLabel="pin-input"
      />
      {showHideButton && (
        <Button
          className="bg-transparent rounded-[50%] w-[24px] h-[24px] cursor-pointer"
          icon={
            <Icon
              size={showHideIconSize}
              source={ShowOrHideInputIcon}
              className="text-finnieTeal-100"
            /> // not sure
          }
          onClick={() => setShowPinInput(!showPinInput)}
        />
      )}
    </div>
  );
}

export default memo(PinInputComponent);
