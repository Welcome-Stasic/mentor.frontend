import TimeContainer from '@/components/Time/TimeContainer';
import { createLoader, parseAsString } from 'nuqs/server';
import type { SearchParams } from 'nuqs/server';

interface IPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const pageSearchParams = {
  dateIn: parseAsString.withDefault(''),
  dateOut: parseAsString.withDefault(''),
};

const loadSearchParams = createLoader(pageSearchParams);

export default async function TimePage({ params, searchParams }: IPageProps) {
  const { slug: userId } = await params;
  const { dateIn, dateOut } = await loadSearchParams(searchParams);

  return <TimeContainer userId={userId} dateIn={dateIn} dateOut={dateOut || dateIn} />;
}
