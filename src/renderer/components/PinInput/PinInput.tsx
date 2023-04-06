import { HideEyeLine, ViewShowLine, Icon } from '@_koii/koii-styleguide';
import React, { memo, useState } from 'react';
import ReactPinInput from 'react-pin-input';

import { Button } from '../ui/Button';

type PropsType = Readonly<{
  onChange: (pin: string) => void;
  onComplete?: () => void;
  initialValue?: string | number;
  showHideButton?: boolean;
  focus?: boolean;
}>;

function PinInput({
  onComplete,
  onChange,
  initialValue,
  showHideButton = true,
  focus = false,
}: PropsType) {
  const [showPinInput, setShowPinInput] = useState(false);
  const [temp, setTemp] = useState('');

  const ShowOrHideInputIcon = showPinInput ? ViewShowLine : HideEyeLine;
  const handleOnInput = (value: string) => {
    onChange(value);
    setTemp(value);
  };
  const pinInputInitValueOnRender = temp || initialValue;
  const shouldFocus = focus && !temp;

  return (
    <div className="z-50 flex items-center">
      {showPinInput && (
        <ReactPinInput
          focus={shouldFocus}
          length={6}
          initialValue={pinInputInitValueOnRender}
          secret={false}
          onChange={handleOnInput}
          type="numeric"
          inputMode="number"
          onComplete={onComplete}
          autoSelect
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
          ariaLabel="pin-input"
        />
      )}
      {!showPinInput && (
        <ReactPinInput
          focus={shouldFocus}
          length={6}
          initialValue={pinInputInitValueOnRender}
          secret
          onChange={handleOnInput}
          type="numeric"
          inputMode="number"
          onComplete={onComplete}
          autoSelect
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
          ariaLabel="pin-input"
        />
      )}
      {showHideButton && (
        <Button
          className="bg-finnieTeal-100 rounded-[50%] w-[24px] h-[24px] cursor-pointer"
          icon={
            <Icon source={ShowOrHideInputIcon} className="text-black w-5 h-5" /> // not sure
          }
          onClick={() => setShowPinInput(!showPinInput)}
        />
      )}
    </div>
  );
}

export default memo(PinInput);
