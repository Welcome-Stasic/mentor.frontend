import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export function useLogout(redirectUrl: string = '/Account/Login') {
  const router = useRouter();

  const logout = () => {
    deleteCookie('token');
    router.replace(redirectUrl);
  };

  return {
    logout
  }
}
