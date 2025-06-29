import { Suspense } from 'react';
import BackdropLoader from '../BackdropLoader';
import ResetPasswordClientForm from './ResetPasswordClientForm';

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<BackdropLoader open />}>
      <ResetPasswordClientForm />
    </Suspense>
  );
}
