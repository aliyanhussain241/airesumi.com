import { motion, type HTMLMotionProps } from 'motion/react';
import { forwardRef } from 'react';

type MultiStepFormShellProps = HTMLMotionProps<'div'> & {
  /**
   * Controls how much space sits between the fixed header and the page content.
   * - `flush`: `pt-app-header` (68px)
   * - `comfortable` (default): `pt-app-header-lg` (~88px)
   * - `spacious`: `pt-app-header-xl` (~104px)
   */
  headerGap?: 'flush' | 'comfortable' | 'spacious';
  /** Tailwind max-width utility for the inner column. */
  maxWidth?: string;
};

const gapClass = {
  flush: 'pt-app-header',
  comfortable: 'pt-app-header-lg',
  spacious: 'pt-app-header-xl',
} as const;

/**
 * Shared layout wrapper for every multi-step form (Details → Design → Job).
 * Owns the fixed-header offset so pages never hand-tune `pt-[xxpx]` again.
 */
export const MultiStepFormShell = forwardRef<HTMLDivElement, MultiStepFormShellProps>(
  ({ headerGap = 'comfortable', maxWidth = 'max-w-7xl', className = '', children, ...motionProps }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        {...motionProps}
        className={`${maxWidth} mx-auto ${gapClass[headerGap]} pb-10 lg:pb-14 px-4 sm:px-6 lg:px-8 print:hidden min-h-screen ${className}`}
      >
        {children}
      </motion.div>
    );
  }
);

MultiStepFormShell.displayName = 'MultiStepFormShell';
