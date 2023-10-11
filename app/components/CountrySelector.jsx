import {useFetcher, useLocation, useMatches} from '@remix-run/react';
import {useCallback, useEffect, useRef} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';
import {CartForm} from '@shopify/hydrogen';

import {Heading, Button, IconCheck} from '~/components';
import {DEFAULT_LOCALE, missingClass} from '~/lib/utils';

export function CountrySelectorBig() {
  const [root] = useMatches();
  const fetcher = useFetcher();
  const closeRef = useRef(null);
  const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const countries = fetcher.data ?? {};
  const defaultLocale = countries?.['default'];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : '';

  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === 'loading') return;
    fetcher.load('/api/countries');
  }, [inView, fetcher]);

  const closeDropdown = useCallback(() => {
    closeRef.current?.removeAttribute('open');
  }, []);

  return (
    <section
      ref={observerRef}
      className="grid w-full gap-4 pointer-events-auto"
      onMouseLeave={closeDropdown}
    >
      <Heading size="lead" className="cursor-default" as="h3">
        Country
      </Heading>
      <div className="relative">
        <details
          className="absolute w-full border rounded border-contrast/30 dark:border-white open:round-b-none overflow-clip"
          ref={closeRef}
        >
          <summary className="flex items-center justify-between w-full px-4 py-3 cursor-pointer">
            {selectedLocale.label}
          </summary>
          <div className="w-full overflow-auto border-t border-contrast/30 dark:border-white bg-contrast/30 max-h-36">
            {countries &&
              Object.keys(countries).map((countryPath) => {
                const countryLocale = countries[countryPath];
                const isSelected =
                  countryLocale.language === selectedLocale.language &&
                  countryLocale.country === selectedLocale.country;

                const countryUrlPath = getCountryUrlPath({
                  countryLocale,
                  defaultLocalePrefix,
                  pathWithoutLocale,
                });

                return (
                  <Country
                    key={countryPath}
                    closeDropdown={closeDropdown}
                    countryUrlPath={countryUrlPath}
                    isSelected={isSelected}
                    countryLocale={countryLocale}
                  />
                );
              })}
          </div>
        </details>
      </div>
    </section>
  );
}

export function CountrySelectorSmall({
  as: Component = 'section',
  className,
  borderColor = 'borderColors',
  size,
  width,
  children,
  ...props
}) {
  const [root] = useMatches();
  const fetcher = useFetcher();
  const closeRef = useRef(null);
  const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const countries = fetcher.data ?? {};
  const defaultLocale = countries?.['default'];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : '';
  function checkforDefaultLocale() {
    if (root.data?.selectedLocale.pathPrefix === '') {
      return true;
    }
    return false;
  }
  const isDefaultLocale = checkforDefaultLocale();

  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === 'loading') return;
    fetcher.load('/api/countries');
  }, [inView, fetcher]);

  const closeDropdown = useCallback(() => {
    closeRef.current?.removeAttribute('open');
  }, []);

  const borderColors = {
    default: 'border-primary dark:border-primary',
    navDrawer: 'border-contrast dark:border-contrast',
  };

  const sizes = {
    default: '',
    navDrawer: '',
  };

  const widths = {
    default: '',
    navDrawer: '',
  };

  const styles = clsx(
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'dark:') && borderColors[borderColor],
    sizes[size],
    className,
  );

  return (
    <Component
      ref={observerRef}
      className="grid grid-cols-2 w-full gap-0 md:pr-4 lg:pr-24 md:pb-4 lg:pb-0"
      onMouseLeave={closeDropdown}
    >
      <div className="md:pb-8">
        <details
          className={`absolute w-1/3 lg:w-[9.5rem] border rounded border-contrast/30 open:round-b-none overflow-clip ${styles}`}
          ref={closeRef}
        >
          <summary
            className={`flex items-center justify-between w-full md:px-4 md:py-2 cursor-pointer ${styles}`}
          >
            {isDefaultLocale ? 'Country' : selectedLocale.label}
          </summary>
          <div
            className={`w-full overflow-auto border-t border-contrast/30 dark:border-white bg-contrast/30 max-h-36 ${styles}`}
          >
            {countries &&
              Object.keys(countries).map((countryPath) => {
                const countryLocale = countries[countryPath];
                const isSelected =
                  countryLocale.language === selectedLocale.language &&
                  countryLocale.country === selectedLocale.country;

                const countryUrlPath = getCountryUrlPath({
                  countryLocale,
                  defaultLocalePrefix,
                  pathWithoutLocale,
                });

                return (
                  <Country
                    key={countryPath}
                    closeDropdown={closeDropdown}
                    countryUrlPath={countryUrlPath}
                    isSelected={isSelected}
                    countryLocale={countryLocale}
                  />
                );
              })}
          </div>
        </details>
      </div>
    </Component>
  );
}

function Country({closeDropdown, countryLocale, countryUrlPath, isSelected}) {
  return (
    <ChangeLocaleForm
      key={countryLocale.country}
      redirectTo={countryUrlPath}
      buyerIdentity={{
        countryCode: countryLocale.country,
      }}
    >
      <Button
        className={clsx([
          'text-contrast dark:text-primary',
          'bg-primary dark:bg-contrast w-full p-2 transition rounded flex justify-start',
          'items-center text-left cursor-pointer py-2 px-4',
        ])}
        type="submit"
        variant="primary"
        onClick={closeDropdown}
      >
        {countryLocale.label}
        {isSelected ? (
          <span className="ml-2">
            <IconCheck />
          </span>
        ) : null}
      </Button>
    </ChangeLocaleForm>
  );
}

function ChangeLocaleForm({children, buyerIdentity, redirectTo}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{
        buyerIdentity,
      }}
    >
      <>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {children}
      </>
    </CartForm>
  );
}

function getCountryUrlPath({
  countryLocale,
  defaultLocalePrefix,
  pathWithoutLocale,
}) {
  let countryPrefixPath = '';
  const countryLocalePrefix = `${countryLocale.language}-${countryLocale.country}`;

  if (countryLocalePrefix !== defaultLocalePrefix) {
    countryPrefixPath = `/${countryLocalePrefix.toLowerCase()}`;
  }
  return `${countryPrefixPath}${pathWithoutLocale}`;
}
