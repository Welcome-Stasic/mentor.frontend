import TimeTrackingClient from '@/components/Time/TimeTrackingClient';
import { Suspense } from 'react';

export default async function TimeTrackingPage() {
  return (
    <Suspense>
      <TimeTrackingClient />
    </Suspense>
  );
}
