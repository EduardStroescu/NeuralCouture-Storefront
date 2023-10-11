import {useEffect, useRef, useState} from 'react';
import {CarouselHandles, ProductCard, Section} from '~/components';
import {useContainerWidth} from '~/hooks/useContainerWidth';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  className = '',
  buttonLeft,
  buttonRight,
  ...props
}) {
  const relatedProductsRef = useRef();
  const carouselRef = useRef();
  const {offsetWidth, scrollWidth} = useContainerWidth(carouselRef);
  const [xPos, setXPos] = useState(0);
  const translateX = (direction) => {
    direction === 'left'
      ? setXPos((x) => (x === 0 ? 0 : x - offsetWidth / 2))
      : setXPos((x) =>
          x >= scrollWidth - offsetWidth ? 0 : x + offsetWidth / 2,
        );
  };

  return (
    <Section
      heading={title}
      padding="y"
      {...props}
      className="w-full pointer-events-auto"
    >
      <div className="relative flex flex-row items-center justify-center w-full hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 overflow-hidden">
        <CarouselHandles
          translateX={translateX}
          buttonLeft={buttonLeft}
          buttonRight={buttonRight}
          className={className}
          width={'w-full'}
        />
        <div
          ref={carouselRef}
          className="w-[calc(100vw-7rem)] lg:w-[calc(100vw-11.5rem)] overflow-hidden"
        >
          <div
            style={{
              transform: `translateX(-${xPos}px)`,
              transition: '0.5s ease-in-out',
            }}
            className="w-full flex flex-row justify-start items-start flex-nowrap gap-2 flex-none"
          >
            {products.nodes.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                className="snap-start rounded w-28 lg:w-60 overflow-hidden flex-[1_1_1]"
                relatedProductsRef={relatedProductsRef}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
