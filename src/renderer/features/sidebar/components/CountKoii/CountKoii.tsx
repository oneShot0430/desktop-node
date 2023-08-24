import React from 'react';
import CountUp from 'react-countup';

import { Tooltip } from 'renderer/components/ui/Tooltip';
import { usePrevious } from 'renderer/features/common';
import { Theme } from 'renderer/types/common';
import { getKoiiFromRoe, getFullKoiiFromRoe } from 'utils';

import { countDecimals } from '../../utils';

export const TOO_SMALL_KOII_AMOUNT_PLACEHOLDER = '< 0.001';

type PropsType = {
  value: number;
};

export function CountKoii({ value }: PropsType) {
  const roundedValue = getKoiiFromRoe(value);
  const fullValue = getFullKoiiFromRoe(value);
  const previousValue = usePrevious(roundedValue);
  const decimalsAmount = countDecimals(roundedValue);
  const isVerySmallKoiiAmount = fullValue < 0.001 && fullValue > 0;

  const hoverValue = fullValue.toFixed(10);

  return (
    <Tooltip
      placement="top-left"
      tooltipContent={hoverValue}
      theme={Theme.Light}
    >
      {isVerySmallKoiiAmount ? (
        <span>{TOO_SMALL_KOII_AMOUNT_PLACEHOLDER}</span>
      ) : (
        <CountUp
          decimals={decimalsAmount}
          start={previousValue}
          end={roundedValue}
          duration={0.5}
        />
      )}
    </Tooltip>
  );
}
