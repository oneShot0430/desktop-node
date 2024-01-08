import React from 'react';
import CountUp from 'react-countup';

import { Tooltip } from 'renderer/components/ui';
import { usePrevious } from 'renderer/features/common';
import { Theme } from 'renderer/types/common';
import { getKoiiFromRoe, getFullKoiiFromRoe } from 'utils';

import { countDecimals } from '../../utils';

export const TOO_SMALL_KOII_AMOUNT_PLACEHOLDER = '< 0.001 KOII';

type PropsType = {
  value: number;
};

export function CountKoii({ value }: PropsType) {
  const roundedValue = getKoiiFromRoe(value);
  const fullValue = getFullKoiiFromRoe(value);
  const previousValue = usePrevious(roundedValue);
  const decimalsAmount = countDecimals(fullValue);
  const isVerySmallKoiiAmount = fullValue < 0.001 && fullValue > 0;
  const decimals = roundedValue < 100 ? 2 : 0;
  return (
    <Tooltip
      placement="top-right"
      tooltipContent={fullValue.toPrecision(
        decimalsAmount < 3 ? 4 : decimalsAmount
      )}
      theme={Theme.Light}
    >
      {isVerySmallKoiiAmount ? (
        <span>{TOO_SMALL_KOII_AMOUNT_PLACEHOLDER}</span>
      ) : (
        <span>
          <CountUp
            decimals={decimals}
            start={previousValue}
            end={roundedValue}
            duration={0.5}
            data-testid="count-koii"
          />
          <span> KOII</span>
        </span>
      )}
    </Tooltip>
  );
}
