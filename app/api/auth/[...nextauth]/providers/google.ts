import GoogleProvider from "next-auth/providers/google";

export const CustomGoogleProvider = GoogleProvider({
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    },
  },
});
