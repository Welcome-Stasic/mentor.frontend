// ✅ Родительская страница
import TimeContainer from '@/components/Time/TimeContainer';
import { createLoader, parseAsString } from 'nuqs/server';
import type { SearchParams } from 'nuqs/server';

const pageSearchParams = {
  dateIn: parseAsString.withDefault(''),
  dateOut: parseAsString.withDefault(''),
};

const loadSearchParams = createLoader(pageSearchParams);

export default async function TimePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: SearchParams;
}) {
  const { slug: userId } = params;
  const { dateIn, dateOut } = await loadSearchParams(searchParams);

  return <TimeContainer userId={userId} dateIn={dateIn} dateOut={dateOut || dateIn} />;
}
