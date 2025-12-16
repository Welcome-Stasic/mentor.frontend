"use client";

import { Box, Button, Skeleton, Tooltip, useMediaQuery } from "@mui/material";
import CalendarItem from "./CalendarItem";
import dayjs from "dayjs";
import { IReportTimeItem, IWorkTime } from "@/lib/axios/types/time";
import { useMemo } from "react";
import { PAGE } from "@/constants";

interface ICalendarProps {
  crmId: string;
  year: number;
  month: number;
  timeItems: IReportTimeItem[];
  workItems: IWorkTime[];
  isLoading: boolean;
}

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const Calendar = ({
  crmId,
  year,
  month,
  timeItems,
  workItems,
  isLoading,
}: ICalendarProps) => {
  const firstDay = dayjs(new Date(year, month, 1));
  const startDayIndex = (firstDay.day() + 6) % 7; // Пн = 0, Вс = 6
  const daysInMonth = firstDay.daysInMonth();
  const totalSlots = startDayIndex + daysInMonth;
  const totalCells = Math.ceil(totalSlots / 7) * 7;
  const isMobile = useMediaQuery("(max-width:768px)");

    const workDetailMap = useMemo(() => {
    const map = new Map<string, Array<{
      task: string;
      comment?: string;
      minutes: number;
      project?: string;
    }>>();
    
    workItems.forEach((item) => {
      const key = dayjs(item.dateTime).format("YYYY-MM-DD");
      if (!map.has(key)) map.set(key, []);
      
      map.get(key)?.push({
        task: item.task,
        comment: item.comment,
        minutes: item.minutes ?? 0,
        project: item.project?.trim(),
      });
    });
    
    return map;
  }, [workItems]);
  
  // Группируем тайм-данные по дате
  const timeMap = useMemo(() => {
    const map = new Map<string, number>();
    timeItems.forEach((item) => {
      const key = dayjs(item.timeIn).format("YYYY-MM-DD");
      map.set(key, (map.get(key) || 0) + item.fullTime);
    });
    return map;
  }, [timeItems]);

  const workMap = useMemo(() => {
    const map = new Map<string, number>();
    workItems.forEach((item) => {
      const key = dayjs(item.dateTime).format("YYYY-MM-DD");
      map.set(key, (map.get(key) || 0) + (item.minutes ?? 0));
    });
    return map;
  }, [workItems]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${isMobile ? "3" : "7"}, 1fr)`,
        gap: 1,
      }}
    >
      {/* Заголовки дней недели */}
      {!isMobile &&
        daysOfWeek.map((day) => (
          <Box
            key={day}
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              padding: "4px 0",
            }}
          >
            {day}
          </Box>
        ))}
      {isLoading &&
        Array.from({ length: totalCells }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={isMobile ? 100 : 150}
          />
        ))}
      {!isLoading &&
        Array.from({ length: totalCells }).map((_, index) => {
          const dayNumber = index - startDayIndex + 1;

          // --- Предыдущий месяц ---
          if (!isMobile && index < startDayIndex) {
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            const daysInPrevMonth = dayjs(
              new Date(prevYear, prevMonth, 1)
            ).daysInMonth();
            const prevDay = daysInPrevMonth - (startDayIndex - index - 1);

            return (
              <CalendarItem
                key={`prev-${index}`}
                day={prevDay}
                href="#"
                disabled
              />
            );
          }

          // --- Следующий месяц ---
          if (!isMobile && dayNumber > daysInMonth) {
            const nextDay = dayNumber - daysInMonth;

            return (
              <CalendarItem
                key={`next-${index}`}
                day={nextDay}
                href="#"
                disabled
              />
            );
          }

          // --- Пропустить пустые ячейки на мобильном ---
          if (isMobile && (index < startDayIndex || dayNumber > daysInMonth)) {
            return null;
          }

          // --- Текущий месяц ---
          const date = dayjs(new Date(year, month, dayNumber)).format(
            "YYYY-MM-DD"
          );
          const minutes = timeMap.get(date) ?? 0;
          const workMinutes = workMap.get(date) ?? 0;
          const percentage = Math.round(
            (workMinutes / (minutes === 0 ? 480 : minutes)) * 100
          );
          const workTimesDetail = workDetailMap.get(date) ?? [];

          return (

              <CalendarItem
                key={date}
                href={`${PAGE.TIME_TRACKING.pathPrefix}/${crmId}?dateIn=${date}`}
                day={dayNumber}
                time={minutes}
                percentage={percentage}
                workTimesDetail={workTimesDetail}
              />

          );
        })}
    </Box>
  );
};

export default Calendar;
