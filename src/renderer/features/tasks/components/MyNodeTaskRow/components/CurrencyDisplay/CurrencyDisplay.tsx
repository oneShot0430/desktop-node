import React from 'react';

import { Placement } from 'renderer/components';
import { Popover } from 'renderer/components/ui/Popover/Popover';
import { formatNumber } from 'renderer/features/tasks/utils';
import { Theme } from 'renderer/types/common';

const CURRENCIES = {
  KOII: 'KOII',
  ETH: 'ETH',
  USDC: 'USDC',
  USDT: 'USDT',
  BTC: 'BTC',
} as const;

type CurrencyType = keyof typeof CURRENCIES;

type PropsType = {
  currency: CurrencyType;
  amount: number;
  precision?: number;
  tooltipContent?: React.ReactNode;
  tooltipPlacement?: Placement;
};

const getCurrencySuffix = (currency: CurrencyType) => {
  return CURRENCIES[currency] ?? '';
};

export function CurrencyDisplay({
  amount,
  currency = 'KOII',
  precision,
  tooltipContent,
}: PropsType) {
  const content = `${
    precision ? amount.toPrecision(precision) : formatNumber(amount, false)
  } ${getCurrencySuffix(currency)}`;

  return tooltipContent ? (
    <Popover theme={Theme.Dark} tooltipContent={tooltipContent}>
      {content}
    </Popover>
  ) : (
    <span>{content}</span>
  );
}
