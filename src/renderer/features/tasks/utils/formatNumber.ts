export function formatNumber(num: number, withDecimals = true): string {
  if (num >= 1000000) {
    // For millions
    const formatted = withDecimals
      ? (num / 1000000).toPrecision(3)
      : Math.round(num / 1000000);
    return `${formatted}M`;
  } else if (num >= 1000) {
    // For thousands
    const formatted = withDecimals
      ? (num / 1000).toPrecision(3)
      : Math.round(num / 1000);
    return `${formatted}k`;
  } else {
    let formatted;
    if (withDecimals) {
      formatted = num.toPrecision(3);
    } else {
      formatted = Math.round(num).toString();
    }
    return formatted;
  }
}
