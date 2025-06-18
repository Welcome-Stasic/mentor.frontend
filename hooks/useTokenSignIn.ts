"use client";

import { useEffect } from "react";
import { signInWithProvider } from "@/app/api/auth/[...nextauth]/signInWithProvider"; // путь подстрой под свой проект

export function useTokenSignIn(token?: string) {
  useEffect(() => {
    if (!token) return;

    signInWithProvider("token", {
      token,
      redirect: true,
      callbackUrl: "/"
    });
  }, [token]);
}
