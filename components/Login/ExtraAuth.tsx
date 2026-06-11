import { Box, Divider, Typography } from "@mui/material";
import YandexLogin from "./YandexLogin";
import GoogleLogin from "./GoogleLogin";
// import PhoneLogin from "./PhoneLogin";

export default function ExtraAuth() {
  return (
    <Box
      sx={{
        mt: 2,
        width: "100%",
      }}
    >
      <Divider sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Или войдите через
        </Typography>
      </Divider>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            flexWrap: "wrap",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          {/* Кнопка Яндекс */}
          <YandexLogin />
          {/* Кнопка Гугл */}
          {/* <GoogleLogin /> */}
          {/* Кнопка Входа по номеру */}
        {/* <PhoneLogin/> */}
        </Box>
      </Box>
    </Box>
  );
}
