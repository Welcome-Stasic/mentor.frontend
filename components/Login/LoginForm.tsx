import { Suspense } from 'react';
import LoginClientForm from './LoginClientForm';
import BackdropLoader from '../BackdropLoader';
import ExtraAuth from './ExtraAuth';

export default function LoginForm() {
  return (
    <Suspense fallback={<BackdropLoader open />}>
      <LoginClientForm />
      {/* <ExtraAuth /> */}
    </Suspense>
  );
}
