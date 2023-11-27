type timeUnits = 'd' | 'h' | 'm' | 's';

export interface ParsedRoundTime {
  value: number;
  unit: 'd' | 'h' | 'm' | 's';
}

export function parseRoundTime(value: number): ParsedRoundTime {
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
  let formattedValue = `${Math.floor(value)} ${shortToExt[unit]}${
    Math.floor(value) === 1 ? '' : 's'
  }`;
  if (unit === 'm' && !Number.isInteger(value)) {
    const seconds = Math.round((value - Math.floor(value)) * 60);
    formattedValue += ` ${seconds} second${seconds === 1 ? '' : 's'}`;
  }

  return formattedValue;
}
