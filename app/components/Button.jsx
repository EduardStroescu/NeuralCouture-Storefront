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
      'inline-block rounded font-medium text-center py-3 px-6 pointer-events-auto';

    const variants = {
      primary: `${baseButtonClasses} bg-primary text-contrast`,
      overlay: `group rounded text-center cursor-pointer py-1 px-2 text-white/60  bg-opacity-90 hover:bg-opacity-100`,
      secondary: `${baseButtonClasses} border border-primary/10 bg-contrast text-primary`,
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
