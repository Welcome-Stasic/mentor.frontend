import { signIn } from 'next-auth/react';

type Provider = 'crm' | 'credentials';

// Описываем параметры для каждого провайдера:
type SignInParams<T extends Provider> = 
  T extends 'crm' ? {
    login: string;
    password: string;
    redirect?: boolean;
    callbackUrl?: string;
  } :
  T extends 'credentials' ? {
    email: string;
    password: string;
    redirect?: boolean;
    callbackUrl?: string;
  } :
  never;

export async function signInWithProvider<T extends Provider>(
  provider: T,
  params: SignInParams<T>
) {
  return await signIn(provider, { ...params});
}
