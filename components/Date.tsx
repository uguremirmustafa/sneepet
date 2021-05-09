import React from 'react';
import { formatRelative } from 'date-fns';

const today = new Date();
export default function Date(props) {
  const timeAgo = formatRelative(Date.parse(props?.date), today, {
    weekStartsOn: 1,
  });
  return <div className="date">{timeAgo}</div>;
}
