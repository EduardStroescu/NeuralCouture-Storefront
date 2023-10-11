import {useMatches} from '@remix-run/react';
import {useMemo} from 'react';

import {DEFAULT_LOCALE} from '~/lib/utils';

export function usePageAnalytics({hasUserConsent}) {
  const matches = useMatches();

  return useMemo(() => {
    const data = {};

    matches.forEach((event) => {
      const eventData = event?.data;
      if (eventData) {
        eventData['analytics'] && Object.assign(data, eventData['analytics']);

        const selectedLocale = eventData['selectedLocale'] || DEFAULT_LOCALE;
        Object.assign(data, {
          currency: selectedLocale.currency,
          acceptedLanguage: selectedLocale.language,
        });
      }
    });

    return {
      ...data,
      hasUserConsent,
    };
  }, [matches]);
}
