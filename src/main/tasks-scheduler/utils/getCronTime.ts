import { TimeFormat } from 'models';
/**
 * @dev The standard cron format is a string of five space-separated fields (*****),
 * but used "cron" package requires six fields (******) with seconds as the first field.
 */
export const getCronTime = (startTime: TimeFormat, days: number[]): string => {
  // Regular expression for validating HH:MM:SS format
  const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

  // Check if startTime is in HH:MM:SS format
  if (!timeFormat.test(startTime)) {
    throw new Error('Invalid startTime format. Expected HH:MM:SS.');
  }
  if (!days.every((day) => day >= 0 && day <= 7)) {
    throw new Error('Invalid days array. Expected values between 0 and 7.');
  }

  const [hours, minutes] = startTime.split(':').map(Number);
  const cronDays = days.length > 0 ? days.join(',') : '*';
  const seconds = 0; // Always set seconds to 0
  return `${seconds} ${minutes} ${hours} * * ${cronDays}`;
};
