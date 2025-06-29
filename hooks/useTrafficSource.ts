import { parseAsString, useQueryState } from 'nuqs';

interface ITrafficSource {
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
}

export function useTrafficSource(): ITrafficSource {
  const source = useQueryState('utm_source', parseAsString.withDefault(''));
  const medium = useQueryState('utm_medium', parseAsString.withDefault(''));
  const campaign = useQueryState('utm_campaign', parseAsString.withDefault(''));

  const result: ITrafficSource = {
    source: source[0],
    medium: medium[0],
    campaign: campaign[0],
    referrer: document.referrer || '',
  };

  return result;
}
