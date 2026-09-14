/**
 * RBToast.jsx — Refresh Breeze Custom Toast System (Pure Framer Motion)
 * Icons: react-icons (flat, monochrome) — sudah terinstall di project
 */

import { createPortal } from 'react-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaShoppingBag, FaShoppingCart } from 'react-icons/fa'

// ── Event Bus Global ──────────────────────────────────────────────────────────
let _dispatch = null
const bus = {
  subscribe: (fn) => { _dispatch = fn },
  unsubscribe: () => { _dispatch = null },
  emit: (toast) => { if (_dispatch) _dispatch(toast) }
}

let _id = 0
const nextId = () => ++_id

const DURATION = 1600

// Icon map — flat react-icons
const ICON_MAP = {
  success: FaCheckCircle,
  error: FaTimesCircle,
  info: FaInfoCircle,
  cart: FaShoppingCart,
  merch: FaShoppingBag,
}

const ICON_COLOR = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#60a5fa',
  cart: '#079108',
  merch: '#a78bfa',
}

// ── Single Toast Pill Component ───────────────────────────────────────────────
const ToastCard = ({ t, isDark, onDismiss }) => {
  const IconComp = ICON_MAP[t.type] || FaInfoCircle
  const iconColor = ICON_COLOR[t.type] || '#60a5fa'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      onClick={onDismiss}
      className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl border select-none cursor-pointer backdrop-blur-xl ${
        isDark
          ? 'bg-[#111726]/95 border-white/10 text-white shadow-black/50'
          : 'bg-white/95 border-gray-200/80 text-gray-900 shadow-xl'
      }`}
      style={{ maxWidth: '90vw' }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconColor + '20' }}
      >
        <IconComp style={{ color: iconColor, fontSize: '13px' }} />
      </div>
      <div className="flex flex-col pr-2">
        <span className={`text-xs font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </span>
        {t.sub && (
          <span className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
            {t.sub}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ── Toast Container Portal ────────────────────────────────────────────────────
export const RBToastContainer = () => {
  const [toasts, setToasts] = useState([])
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id])
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((toast) => {
    const id = nextId()
    setToasts(prev => {
      prev.forEach(t => clearTimeout(timers.current[t.id]))
      return [{ ...toast, id }]
    })
    timers.current[id] = setTimeout(() => dismiss(id), DURATION)
  }, [dismiss])

  useEffect(() => {
    bus.subscribe(add)
    return () => bus.unsubscribe()
  }, [add])

  return createPortal(
    <div className="fixed top-24 inset-x-0 z-[999999] flex flex-col items-center pointer-events-none px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <ToastCard key={t.id} t={t} isDark={isDark} onDismiss={() => dismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}

// ── Public API ────────────────────────────────────────────────────────────────
export const rbToast = {
  cart: (memberName, qty = 1) => {
    bus.emit({
      type: 'cart',
      title: memberName,
      sub: qty > 1 ? `Jumlah bertambah (${qty}x di keranjang)` : 'Masuk ke keranjang!',
    })
  },

  group: (qty = 1) => {
    bus.emit({
      type: 'cart',
      title: 'Cheki Group',
      sub: qty > 1 ? `Jumlah bertambah (${qty}x di keranjang)` : 'Foto bareng seluruh member RB',
    })
  },

  merch: (itemName, qty = 1) => {
    bus.emit({
      type: 'merch',
      title: itemName,
      sub: qty > 1 ? `Jumlah bertambah (${qty}x di keranjang)` : 'Merchandise resmi masuk keranjang',
    })
  },

  success: (message, sub) => bus.emit({ type: 'success', title: message, sub }),
  error: (message, sub) => bus.emit({ type: 'error', title: message, sub }),
  info: (message, sub) => bus.emit({ type: 'info', title: message, sub }),
}
