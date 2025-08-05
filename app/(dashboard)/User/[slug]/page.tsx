import { UserPageClient } from '@/components/Users/UserPageClient';
import { Suspense } from 'react';

interface IPageProps {
  params: Promise<{ slug: string }>;
}

export default async function UserPage({ params }: IPageProps) {
  const { slug: userId } = await params;

  return (
    <Suspense>
      <UserPageClient userId={userId} />
    </Suspense>
  );
}
