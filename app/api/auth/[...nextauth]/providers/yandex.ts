import YandexProvider from 'next-auth/providers/yandex';

export const CustomYandexProvider = YandexProvider({
  clientId: process.env.YANDEX_CLIENT_ID!,
  clientSecret: process.env.YANDEX_CLIENT_SECRET!,
  profile: async (profile) => {
    throw new Error("Пользователь не найден в CRM");
    // try {
    //   // Проверка пользователя в CRM
    //   const res = await axios.post(
    //     `${process.env.CRM_API_URL}/get-user`,
    //     { email: profile?.emails?.[0]?.value || profile?.email },
    //     { headers: { Authorization: `Bearer ${process.env.CRM_API_KEY}` } }
    //   );

    //   const crmUser = res.data;

    //   if (!crmUser?.id) {
    //     throw new Error("Пользователь не найден в CRM");
    //   }

    //   return {
    //     id: crmUser.id,
    //     name: crmUser.name || profile.displayName,
    //     email: crmUser.email || profile?.email,
    //     roles: crmUser.roles || [],
    //     crm: crmUser,
    //   };
    // } catch (error) {
    //   console.error("Ошибка проверки в CRM:", error);
    //   // Если CRM не обязательна — возвращаем только Яндекс-профиль
    //   return {
    //     id: profile.id,
    //     name: profile.displayName,
    //     email: profile?.emails?.[0]?.value || profile?.email,
    //     roles: [],
    //   };
    // }
  },
});
