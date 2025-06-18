// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string
      roles?: string[]
      accessToken: string
      refreshToken?: string
    }
  }

  interface User {
    id: string
    email?: string
    roles?: string[]
    accessToken: string
    refreshToken?: string
    accessTokenExpires: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken?: string
  }
}
