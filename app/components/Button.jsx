import {forwardRef} from 'react';
import {Link} from '@remix-run/react';
import clsx from 'clsx';

import {missingClass} from '~/lib/utils';

export const Button = forwardRef(
  (
    {
      as = 'button',
      className = '',
      variant = 'primary',
      width = 'auto',
      ...props
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    const baseButtonClasses =
      'inline-block rounded font-medium text-center py-3 px-6';

    const variants = {
      primary: `${baseButtonClasses} bg-black text-white pointer-events-auto`,
      overlay: `group rounded text-center py-1 px-2 bg-black text-white/60 pointer-events-auto bg-opacity-90 hover:bg-opacity-100`,
      secondary: `${baseButtonClasses} border border-primary/60 bg-contrast text-primary pointer-events-auto`,
      inline:
        'border-b border-primary/10 leading-none pb-1 pointer-events-auto',
    };

    const widths = {
      auto: 'w-auto',
      full: 'w-full',
    };

    const styles = clsx(
      missingClass(className, 'bg-') && variants[variant],
      missingClass(className, 'w-') && widths[width],
      className,
    );

    return <Component className={styles} {...props} ref={ref} />;
  },
);
