import { Middleware } from "./types"

export const useLogger: Middleware = (req) => {
  console.log(`[LOG] ${req.method} ${req.nextUrl.pathname}`)
}