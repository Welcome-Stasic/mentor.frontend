import { DashboardClientPageTitle } from './DashboardClientPageTitle';
import { Suspense } from 'react';

export function DashboardPageTitle() {
  return (
    <Suspense fallback="...">
      <DashboardClientPageTitle />
    </Suspense>
  );
}
