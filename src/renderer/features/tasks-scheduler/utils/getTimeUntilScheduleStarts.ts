import { set, isPast, addDays } from 'date-fns';

export function getTimeUntilScheduleStarts(
  startTime: string,
  days: number[]
): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const now = new Date();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 14; i++) {
    const targetDay = (now.getDay() + i) % 7;
    if (days.includes(targetDay)) {
      const targetDate = addDays(now, i);
      const eventDate = set(targetDate, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      });

      if (i === 0 && isPast(eventDate)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const diffInMilliseconds = eventDate.getTime() - now.getTime();
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(
        (diffInMilliseconds / (1000 * 60 * 60)) % 24
      );
      const diffInMinutes = Math.floor((diffInMilliseconds / (1000 * 60)) % 60);

      let timeUntilStart = '';
      if (diffInDays > 0) timeUntilStart += `${diffInDays} days `;
      if (diffInHours > 0 || diffInDays > 0)
        timeUntilStart += `${diffInHours} hours `;
      if (diffInMinutes > 0 || diffInHours > 0 || diffInDays > 0)
        timeUntilStart += `${diffInMinutes} minutes`;

      return timeUntilStart.trim();
    }
  }

  return 'No event scheduled';
}
