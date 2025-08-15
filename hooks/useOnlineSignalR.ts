'use client';

import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useSession } from "next-auth/react";
import { BASE_URL } from "@/lib/axios/axios";
import { useCurrentUserStore } from "@/providers/current-user-provider";

export function useOnlineSignalR() {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
    
  const setOnlineUser = useCurrentUserStore((s) => s.setOnlineUser);
  const removeOnlineUser = useCurrentUserStore((s) => s.removeOnlineUser);

  useEffect(() => {
    if (!accessToken) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/OnlineHub`, {
        withCredentials: true,
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    connection.on("UserOnline", (userId: string) => {
      setOnlineUser(userId);
    });

    connection.on("UserOffline", (userId: string) => {
      removeOnlineUser(userId);
    });

    connection
      .start()
      .then(() => connection.invoke<string[]>("GetOnlineUsers"))
      .then((users) => {
        users.forEach((u) => setOnlineUser(u));
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, [accessToken]);
}
