import {IconArrowLeft, IconArrowRight} from '~/components';

export function CarouselHandles({
  translateX,
  className,
  buttonLeft = '',
  buttonRight = '',
  width,
}) {
  return (
    <div
      className={`${className} transparent w-full h-full absolute z-50 flex justify-between rounded pointer-events-none`}
    >
      <button
        onClick={() => translateX('left')}
        className={`group pointer-events-auto ${buttonLeft}`}
      >
        <IconArrowLeft width={width} />
      </button>
      <button
        onClick={() => translateX('right')}
        className={`group pointer-events-auto ${buttonRight}`}
      >
        <IconArrowRight width={width} />
      </button>
    </div>
  );
}
