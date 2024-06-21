import {useMemo, useState} from 'react';
import {Menu, Disclosure} from '@headlessui/react';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import {useDebounce} from 'react-use';

import {Heading, IconFilters, IconCaret, IconXMark, Text} from '~/components';

export function SortFilter({
  filters = [],
  appliedFilters = [],
  children,
  collections = [],
  page,
  currencyCode,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={
            filters.length > 0
              ? 'pointer-events-auto relative flex items-center justify-center w-8 h-8 focus:ring-primary/5'
              : 'pointer-events-none opacity-0'
          }
        >
          <IconFilters />
        </button>
        <SortMenu filters={filters} page={page} />
      </div>
      {filters.length > 0 ? (
        <div className="flex flex-col flex-wrap md:flex-row pointer-events-none">
          <div
            className={`transition-all duration-200 ${
              isOpen
                ? 'opacity-100 min-w-full md:min-w-[240px] md:w-[240px] md:pr-8 max-h-full pointer-events-auto'
                : 'hidden opacity-0 md:min-w-[0px] md:w-[0px] pr-0 max-h-0 md:max-h-full'
            }`}
          >
            <FiltersDrawer
              collections={collections}
              filters={filters}
              appliedFilters={appliedFilters}
              currencyCode={currencyCode}
            />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      ) : null}
    </>
  );
}

export function FiltersDrawer({
  filters = [],
  appliedFilters = [],
  currencyCode,
}) {
  const [params] = useSearchParams();
  const location = useLocation();

  const filterMarkup = (filter, option) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const min =
          params.has('minPrice') && !isNaN(Number(params.get('minPrice')))
            ? Number(params.get('minPrice'))
            : undefined;

        const max =
          params.has('maxPrice') && !isNaN(Number(params.get('maxPrice')))
            ? Number(params.get('maxPrice'))
            : undefined;

        return (
          <PriceRangeFilter min={min} max={max} currencyCode={currencyCode} />
        );

      default:
        const to = getFilterLink(filter, option.input, params, location);
        return (
          <Link
            className="focus:underline hover:underline"
            prefetch="intent"
            to={to}
          >
            {option.label}
          </Link>
        );
    }
  };

  return (
    <>
      <nav className="py-8">
        {appliedFilters.length > 0 ? (
          <div className="pb-8">
            <AppliedFilters
              filters={appliedFilters}
              currencyCode={currencyCode}
            />
          </div>
        ) : null}
        <Heading as="h4" size="lead" className="pb-4">
          Filter By
        </Heading>
        <div className="divide-y">
          {filters.map(
            (filter) =>
              filter.values.length >= 1 && (
                <Disclosure as="div" key={filter.id} className="w-full">
                  {({open}) => (
                    <>
                      <Disclosure.Button className="flex justify-between w-full py-4">
                        <Text size="lead">{filter.label}</Text>
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </Disclosure.Button>
                      <Disclosure.Panel key={filter.id}>
                        <ul key={filter.id} className="py-2">
                          {filter.values?.map((option) => {
                            return (
                              <li key={option.id} className="pb-4">
                                {filterMarkup(filter, option)}
                              </li>
                            );
                          })}
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ),
          )}
        </div>
      </nav>
    </>
  );
}

function AppliedFilters({filters = []}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      <Heading as="h4" size="lead" className="pb-4">
        Applied filters
      </Heading>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          return (
            <Link
              to={getAppliedFilterLink(filter, params, location)}
              className="flex px-2 border rounded-full gap"
              key={`${filter.label}-${filter.urlParam}`}
            >
              <span className="flex-grow">{filter.label}</span>
              <span>
                <IconXMark />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function getAppliedFilterLink(filter, params, location) {
  const paramsClone = new URLSearchParams(params);
  if (filter.urlParam.key === 'variantOption') {
    const variantOptions = paramsClone.getAll('variantOption');
    const filteredVariantOptions = variantOptions.filter(
      (options) => !options.includes(filter.urlParam.value),
    );
    paramsClone.delete(filter.urlParam.key);
    for (const filteredVariantOption of filteredVariantOptions) {
      paramsClone.append(filter.urlParam.key, filteredVariantOption);
    }
  } else {
    paramsClone.delete(filter.urlParam.key);
  }
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getSortLink(sort, params, location) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

function getFilterLink(filter, rawInput, params, location) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(filter.type, rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({max, min, currencyCode}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min ? String(min) : '');
  const [maxPrice, setMaxPrice] = useState(max ? String(max) : '');

  useDebounce(
    () => {
      if (
        (minPrice === '' || minPrice === String(min)) &&
        (maxPrice === '' || maxPrice === String(max))
      )
        return;

      const price = {};
      if (minPrice !== '') price.min = minPrice;
      if (maxPrice !== '') price.max = maxPrice;

      const newParams = filterInputToParams('PRICE_RANGE', {price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event) => {
    const newMaxPrice = event.target.value;
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event) => {
    const newMinPrice = event.target.value;
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-4">
        <span className="px-4 md:px-0">Min</span>
        <input
          name="maxPrice"
          className="text-primary rounded bg-blur-lg bg-black/60"
          type="number"
          defaultValue={min}
          placeholder={`${currencyCode ? currencyCode : 'RON'}`}
          onChange={onChangeMin}
        />
      </label>
      <label>
        <span className="px-4 md:px-0">Max</span>
        <input
          name="minPrice"
          className="text-primary rounded bg-blur-lg bg-black/60"
          type="number"
          defaultValue={max}
          placeholder={`${currencyCode ? currencyCode : 'RON'}`}
          onChange={onChangeMax}
        />
      </label>
    </div>
  );
}

function filterInputToParams(type, rawInput, params) {
  const input = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;
  switch (type) {
    case 'PRICE_RANGE':
      if (input.price.min) params.set('minPrice', input.price.min);
      if (input.price.max) params.set('maxPrice', input.price.max);
      break;
    case 'LIST':
      Object.entries(input).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        } else if (typeof value === 'boolean') {
          params.set(key, value.toString());
        } else {
          const {name, value: val} = value;
          const allVariants = params.getAll(`variantOption`);
          const newVariant = `${name}:${val}`;
          if (!allVariants.includes(newVariant)) {
            params.append('variantOption', newVariant);
          }
        }
      });
      break;
  }

  return params;
}

export default function SortMenu({page = 'default'}) {
  function pageType(page) {
    if (page === 'default') {
      return [
        {label: 'Featured', key: 'featured'},
        {label: 'Product Type', key: 'product-type'},
        {
          label: 'Price: Low - High',
          key: 'price-low-high',
        },
        {
          label: 'Price: High - Low',
          key: 'price-high-low',
        },
        {
          label: 'Best Selling',
          key: 'best-selling',
        },
        {
          label: 'Newest',
          key: 'newest',
        },
      ];
    } else {
      return [
        {label: 'Product Type', key: 'product-type'},
        {
          label: 'Price: Low - High',
          key: 'price-low-high',
        },
        {
          label: 'Price: High - Low',
          key: 'price-high-low',
        },
        {
          label: 'Best Selling',
          key: 'best-selling',
        },
      ];
    }
  }
  const items = pageType(page);
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem = items.find((item) => item.key === params.get('sort'));

  return (
    <Menu as="div" className="relative z-40 pointer-events-auto">
      <Menu.Button className="flex items-center">
        <span className="px-2">
          <span className="px-2 font-medium">Sort by:</span>
          <span>{(activeItem || items[0]).label}</span>
        </span>
        <IconCaret />
      </Menu.Button>

      <Menu.Items
        as="nav"
        className="absolute right-0 flex flex-col p-4 text-right rounded-sm bg-contrast"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link
                className={`block text-sm text-white/60 hover:text-white pb-2 px-3 ${
                  activeItem?.key === item.key
                    ? 'font-bold text-white/100'
                    : 'font-normal'
                }`}
                to={getSortLink(item.key, params, location)}
              >
                {item.label}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
