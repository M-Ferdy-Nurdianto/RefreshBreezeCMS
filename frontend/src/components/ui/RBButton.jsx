/**
 * RBButton.jsx — Refresh Breeze Consistent Button System
 *
 * Variants: primary | secondary | ghost | danger | outline
 * Sizes: sm | md | lg
 *
 * Usage:
 *   <RBButton variant="primary" size="md" onClick={fn}>Add to Cart</RBButton>
 *   <RBButton variant="outline" isLoading>Loading...</RBButton>
 *   <RBButton variant="ghost" icon={<FaPlus />} />
 */

import { motion } from 'framer-motion'
import { FaSpinner } from 'react-icons/fa'

const SIZES = {
  sm:  'px-4 py-2 text-[11px] rounded-xl gap-1.5',
  md:  'px-6 py-3 text-xs rounded-2xl gap-2',
  lg:  'px-8 py-4 text-sm rounded-[1rem] gap-2.5',
  xl:  'px-10 py-5 text-sm rounded-[1.25rem] gap-3',
}

const VARIANTS = {
  primary: {
    base: 'bg-[#079108] text-white font-black uppercase tracking-widest shadow-lg shadow-[#079108]/20',
    hover: 'hover:bg-[#067a07] hover:shadow-xl hover:shadow-[#079108]/30 hover:-translate-y-0.5',
    active: 'active:scale-95 active:shadow-none',
  },
  secondary: {
    base: 'bg-emerald-50 dark:bg-emerald-500/10 text-[#079108] dark:text-emerald-400 font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-500/20',
    active: 'active:scale-95',
  },
  outline: {
    base: 'bg-transparent border-2 border-[#079108] text-[#079108] dark:text-emerald-400 dark:border-emerald-400 font-black uppercase tracking-widest',
    hover: 'hover:bg-[#079108]/5 dark:hover:bg-emerald-400/10',
    active: 'active:scale-95',
  },
  ghost: {
    base: 'bg-transparent text-gray-600 dark:text-slate-400 font-bold',
    hover: 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10',
    active: 'active:scale-95',
  },
  danger: {
    base: 'bg-red-500 text-white font-black uppercase tracking-widest shadow-lg shadow-red-500/20',
    hover: 'hover:bg-red-600 hover:-translate-y-0.5',
    active: 'active:scale-95',
  },
  dark: {
    base: 'bg-gray-900 dark:bg-white/10 text-white font-black uppercase tracking-widest',
    hover: 'hover:bg-gray-800 dark:hover:bg-white/20',
    active: 'active:scale-95',
  },
}

const RBButton = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  const cls = [
    'inline-flex items-center justify-center font-black transition-all duration-200',
    s,
    v.base,
    !disabled && !isLoading ? v.hover : '',
    !disabled && !isLoading ? v.active : '',
    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ].filter(Boolean).join(' ')

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.01 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      className={cls}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {iconRight && !isLoading && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  )
}

export default RBButton
