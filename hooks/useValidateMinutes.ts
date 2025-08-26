import { useCallback } from 'react';

export const useValidateMinutes = (totalReportMinutes: number, totalWorkMinutes: number) => {
  return useCallback(
    (newMinutes: number, prevMinutes: number = 0): string | null => {
      const availableMinutes = totalReportMinutes - (totalWorkMinutes - prevMinutes);

      if (newMinutes > availableMinutes) {
        if (availableMinutes > 0) {
          return `Можно добавить не больше ${availableMinutes} минут (осталось от отработанного времени)`;
        } else {
          return 'Вы уже заполнили всё отработанное время за сегодня';
        }
      }

      return null;
    },
    [totalReportMinutes, totalWorkMinutes],
  );
};
