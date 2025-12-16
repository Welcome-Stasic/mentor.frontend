"use client";

import { signInWithProvider } from "@/app/api/auth/[...nextauth]/signInWithProvider";
// import { signOut } from "next-auth/react";
import { getTokenFromId } from "@/lib/axios/requests/user";
import {  Button, Card, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface IFormData {
  id: string;
}

export default function SignInId() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      id: "",
    },
  });

  const onSubmit = async (data: IFormData) => {
    if (!data.id.trim()) {
      setError("ID пользователя обязателен");
      return;
    }

    setIsLoading(true);
    setError("");
    const accessToken = session.data?.user.accessToken as string;
    const response = await getTokenFromId(data.id, accessToken);

    const userTokenRes = response ? response.Result as string : "";
    // const userTokenRes = "";
    console.log(accessToken);
    try {
      // await signOut({
      //   redirect: false,
      //   callbackUrl: "/Account/Login",
      // });
      
      const result = await signInWithProvider("token", {
        token: userTokenRes,
        redirect: false,
      });

      if (!result?.ok) {
        return;
      }

      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Ошибка входа:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      sx={{
        width: { xs: 300, sm: 400 },
        borderRadius: 4,
        boxShadow: 3,
        p: 3,
        mt: 4,
      }}
    >
      <Grid
        component="form"
        container
        spacing={2}
        direction="column"
        onSubmit={handleSubmit(onSubmit)}
        suppressHydrationWarning
      >
        <TextField
          {...register("id", {
            required: "ID пользователя обязателен",
            minLength: {
              value: 1,
              message: "Введите корректный ID",
            },
          })}
          label="ID пользователя"
          variant="outlined"
          fullWidth
          error={!!errors.id}
          helperText={errors.id?.message}
          disabled={isLoading}
        />

        {error && (
          <Typography component="div" color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            textTransform: "none",
            fontWeight: "bold",
            mt: 1,
          }}
        >
          {isLoading ? "Вход..." : "Войти под пользователем"}
        </Button>

        <Typography
          component="div"
          variant="caption"
          color="text.secondary"
          textAlign="center"
          mt={2}
        ></Typography>
      </Grid>
    </Card>
  );
}
