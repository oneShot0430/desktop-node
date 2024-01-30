import { format } from 'date-fns';
import React from 'react';

export function DisplayDate({ dateInMs }: { dateInMs: number | string }) {
  const date = new Date(dateInMs);
  const formattedDate = format(date, 'dd MMM yyyy, HH:mm:ss');
  return <div className="text-xs text-white">{formattedDate}</div>;
}
