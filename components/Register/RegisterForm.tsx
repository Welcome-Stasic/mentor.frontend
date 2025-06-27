import RegisterClientForm from './RegisterClientForm';
import BackdropLoader from '../BackdropLoader';
import { Suspense } from 'react';

export default function RegisterForm() {
  return (
    <Suspense fallback={<BackdropLoader open />}>
      <RegisterClientForm />
    </Suspense>
  );
}
