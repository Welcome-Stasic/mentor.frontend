import YandexProvider from 'next-auth/providers/yandex';

export const CustomYandexProvider = YandexProvider({
  clientId: process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_YANDEX_CLIENT_SECRET!,
  authorization: {
    url: "https://oauth.yandex.ru/authorize",
    params: { 
      response_type: "code",
      force_confirm: "true" // всегда подтверждать аккаунт
    },
  },
});
