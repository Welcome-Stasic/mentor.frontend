import { Suspense } from 'react';
import LoginClientForm from './LoginClientForm';
import BackdropLoader from '../BackdropLoader';

export default function LoginForm() {
  return (
    <Suspense fallback={<BackdropLoader open />}>
      <LoginClientForm />
    </Suspense>
  );
}
