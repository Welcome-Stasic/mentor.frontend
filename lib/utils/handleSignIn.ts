import { signInWithProvider } from "@/app/api/auth/[...nextauth]/signInWithProvider";

export async function handleSignIn(login: string, password: string, isCrm: boolean) {
  if (isCrm) {
    await signInWithProvider('crm', {
      login,
      password,
      redirect: true,
      callbackUrl: '/',
    });
  } else {
    await signInWithProvider('credentials', {
      email: login,
      password,
      redirect: true,
      callbackUrl: '/',
    });
  }
}
