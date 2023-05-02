type timeUnits = 'd' | 'h' | 'm' | 's';

export function parseRoundTime(value: number): {
  value: number;
  unit: 'd' | 'h' | 'm' | 's';
} {
  const days = value / (24 * 60 * 60 * 1000);
  if (days > 1) return { value: days, unit: 'd' };

  const hours = value / (60 * 60 * 1000);
  if (hours > 1) return { value: hours, unit: 'h' };

  const minutes = value / (60 * 1000);
  if (minutes > 1) return { value: minutes, unit: 'm' };

  const seconds = value / 1000;
  return { value: seconds, unit: 's' };
}

export function formatRoundTimeWithFullUnit({
  value,
  unit,
}: {
  value: number;
  unit: 'd' | 'h' | 'm' | 's';
}): string {
  const shortToExt: Record<timeUnits, string> = {
    d: 'day',
    h: 'hour',
    m: 'minute',
    s: 'second',
  };
  return `${value} ${shortToExt[unit] ?? unit}${value === 1 ? '' : 's'}`;
}
