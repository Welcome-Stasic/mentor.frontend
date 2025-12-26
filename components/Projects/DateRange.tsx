import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQueryState } from "nuqs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";



export default function DateRange() {
  const [dateFrom, setDateFrom] = useQueryState("dateFrom", {
    parse: (value) => value || "",
    serialize: (value) => value || "",
  });

  const [dateTo, setDateTo] = useQueryState("dateTo", {
    parse: (value) => value || "",
    serialize: (value) => value || "",
  });
  useEffect(() => {
    setDateFrom(dayjs().startOf("month").format("DD.MM.YYYY"));
    setDateTo(dayjs().format('DD.MM.YYYY'));
  }, []);

  const dateFromValue = useMemo(() => {
    return dateFrom ? dayjs(dateFrom, "DD.MM.YYYY") : null;
  }, [dateFrom]);

  const dateToValue = useMemo(() => {
    return dateTo ? dayjs(dateTo, "DD.MM.YYYY") : null;
  }, [dateTo]);

  const handleDateFromChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isValid()) {
      setDateFrom(newValue.format("DD.MM.YYYY"));
    } else {
      setDateFrom(null);
    }
  };

  const handleDateToChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isValid()) {
      setDateTo(newValue.format("DD.MM.YYYY"));
    } else {
      setDateTo(null);
    }
  };

  const handleDateMonthback = () => {
    if (dateFromValue && dateToValue) {
      const newDateFrom = dateFromValue.subtract(1, 'month').startOf('month');
      const newDateTo = dateToValue.subtract(1, 'month').endOf('month');
      
      setDateFrom(newDateFrom.format("DD.MM.YYYY"));
      setDateTo(newDateTo.format("DD.MM.YYYY"));
    }
  };

  const handleDateMonthnext = () => {
    if (dateFromValue && dateToValue) {
      const newDateFrom = dateFromValue.add(1, 'month').startOf('month');
      const newDateTo = dateToValue.add(1, 'month').endOf('month');
      
      setDateFrom(newDateFrom.format("DD.MM.YYYY"));
      setDateTo(newDateTo.format("DD.MM.YYYY"));
    }
  };

  // const handleCurrentMonth = () => {
  //   const currentDateFrom = dayjs().startOf('month');
  //   const currentDateTo = dayjs().endOf('month');
    
  //   setDateFrom(currentDateFrom.format("DD.MM.YYYY"));
  //   setDateTo(currentDateTo.format("DD.MM.YYYY"));
  // };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "14px",
        alignItems: "center",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker", "DatePicker"]}>
          <Box>
            <Typography variant="caption" fontSize="15px">
                Наряды за период:
              </Typography>
            <Box
              sx={{
                marginTop: '20px',
                display: "flex",
                columnGap: "10px",
                pb: "20px",
                alignItems: "center",
              }}
            >
              <IconButton
                color="primary"
                sx={{ mr: "10px" }}
                onClick={handleDateMonthback}
              >
                <ChevronLeft />
              </IconButton>
              <DatePicker
                label="Дата от"
                value={dateFromValue}
                onChange={handleDateFromChange}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
              <DatePicker
                label="Дата до"
                value={dateToValue}
                onChange={handleDateToChange}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
              <IconButton color="primary" onClick={handleDateMonthnext}>
                <ChevronRight />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {/* <Button sx={{ width: '100%' }}
                onClick={handleCurrentMonth}
              >
                Текущий месяц
              </Button> */}
            </Box>
          </Box>
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}