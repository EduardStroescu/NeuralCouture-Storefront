import clsx from 'clsx';

/**
 * A shared component and Suspense call that's used in `App.server.jsx` to let your app wait for code to load while declaring a loading state
 */
export function Skeleton({
  as: Component = 'div',
  width,
  height,
  className,
  ...props
}) {
  const styles = clsx('rounded bg-contrast', className);

  return null;
  // <Component {...props} width={width} height={height} className={styles} />
}
