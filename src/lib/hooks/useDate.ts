import { useState } from 'react';

export function useDate(initialDate: Date) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    setCurrentDate,
    nextMonth,
    previousMonth,
    today,
  };
}