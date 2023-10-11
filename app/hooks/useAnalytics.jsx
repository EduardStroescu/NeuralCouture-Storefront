import {useLocation} from '@remix-run/react';
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  useShopifyCookies,
} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';

import {usePageAnalytics} from './usePageAnalytics';

export function useAnalytics(hasUserConsent) {
  useShopifyCookies({hasUserConsent});

  const location = useLocation();
  const lastLocationKey = useRef('');
  const pageAnalytics = usePageAnalytics({hasUserConsent});

  // Page view analytics
  // We want useEffect to execute only when location changes
  // which represents a page view
  useEffect(() => {
    if (lastLocationKey.current === location.key) return;

    lastLocationKey.current = location.key;

    const payload = {
      ...getClientBrowserParameters(),
      ...pageAnalytics,
    };

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    });
  }, [location, pageAnalytics]);
}
