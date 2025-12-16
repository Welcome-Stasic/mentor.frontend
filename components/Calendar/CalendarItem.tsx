"use client";

import { getColorByPercentage } from "@/lib/utils/getColorByPercentage";
import { Box, Typography, LinearProgress, useMediaQuery, Tooltip } from "@mui/material";
import Link from "next/link";

interface ICalendarItemProps {
  day: number;
  href: string;
  percentage?: number;
  time?: number;
  disabled?: boolean;
  workTimesDetail?: Array<{
    task: string;
    project?: string;
    comment?: string;
    minutes: number;
  }>;
}
const CalendarItem = ({
  day,
  href,
  percentage = 0,
  time = 0,
  disabled = false,
  workTimesDetail = [],
}: ICalendarItemProps) => {
  
  const isMobile = useMediaQuery("(max-width:768px)");

  if (disabled)
    return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ccc",
            padding: 1,
            height: isMobile ? 100 : 150,
            borderRadius: "6px",
            backgroundColor: "#f5f5f5",
            color: "#999",
            fontWeight: "bold",
          }}
        >
          {day}
        </Box>
    );

  const reportHours = Math.floor(time / 60);
  const reportMinutes = time % 60;
  const formattedReportTime = `${reportHours}:${reportMinutes
    .toString()
    .padStart(2, "0")}`;

  const color = getColorByPercentage(percentage);

  const TooltipContent = () => {
    if (workTimesDetail.length === 0) {
      return (
        <Typography variant="body2">
          Трудозатраты не вносились
        </Typography>
      );
    }
    
    const totalWorkMinutes = workTimesDetail.reduce((sum, item) => sum + item.minutes, 0);
    const totalHours = Math.floor(totalWorkMinutes / 60);
    const totalMinutes = totalWorkMinutes % 60;

    return (
      <Box sx={{ p: 0.5, width: '250px'}}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Трудозатраты: {totalHours}:{totalMinutes.toString().padStart(2, '0')}
        </Typography>
        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
          {workTimesDetail.map((item, index) => {
            const itemHours = Math.floor(item.minutes / 60);
            const itemMinutes = item.minutes % 60;
            
            return (
              <Box 
                key={index} 
                sx={{ 
                  mb: 1, 
                  pb: 1, 
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none', mb: 0 }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {item.task}
                </Typography>
                {item.comment && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {item.comment}
                  </Typography>
                )}
                {item.project && (
                  <Typography variant="caption" color="text.secondary">
                    Проект: {item.project}
                  </Typography>
                )}
                <Typography variant="caption" color="primary" display="block" sx={{ mt: 0.5 }}>
                  Время: {itemHours}:{itemMinutes.toString().padStart(2, '0')}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Tooltip 
      title={<TooltipContent />} 
      componentsProps={{
        tooltip: {
          sx: { 
            backgroundColor: 'white', 
            color: 'text.primary', 
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }
        }
      }}
    >
      <Link href={href} style={{ textDecoration: 'none' }}>
        <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ccc",
          padding: 1,
          height: isMobile ? 100 : 150,
          position: "relative",
          borderRadius: "6px",
          overflow: "hidden",
          backgroundColor: "#fafafa",
          textDecoration: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            cursor: "pointer",
            boxShadow: 3,
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ position: "absolute", top: "5px", right: "5px" }}
        >
          {day}
        </Typography>

        <Typography
          variant={isMobile ? "body2" : "body1"}
          sx={{
            color,
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {percentage.toFixed(2)}%
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color,
            position: "absolute",
            bottom: "5px",
            left: "5px",
            fontWeight: 500,
          }}
        >
          {formattedReportTime}
        </Typography>

        {percentage > 0 && (
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: 5,
              backgroundColor: "#eee",
              "& .MuiLinearProgress-bar": {
                backgroundColor: color,
              },
            }}
          />
        )}
      </Box>
      </Link>
    </Tooltip>
  );
};
export default CalendarItem;