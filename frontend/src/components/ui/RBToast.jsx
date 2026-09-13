/**
 * RBToast.jsx — Refresh Breeze Custom Toast System (Pure Framer Motion)
 */

import { createPortal } from 'react-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

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

// ── Single Toast Pill Component ───────────────────────────────────────────────
const ToastCard = ({ t, isDark, onDismiss }) => {
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
          ? 'bg-[#111726]/95 border-emerald-500/30 text-white shadow-emerald-950/50'
          : 'bg-white/95 border-emerald-500/20 text-gray-900 shadow-xl'
      }`}
      style={{ maxWidth: '90vw' }}
    >
      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-base">
        {t.emoji}
      </div>
      <div className="flex flex-col pr-2">
        <span className={`text-xs font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </span>
        {t.sub && (
          <span className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
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
  cart: (memberName, emoji = '💚', qty = 1) => {
    bus.emit({
      emoji,
      title: memberName,
      sub: qty > 1 ? `Jumlah bertambah (${qty}x di keranjang)` : 'Masuk ke keranjang!',
    })
  },

  group: (qty = 1) => {
    bus.emit({
      emoji: '💚',
      title: 'Cheki Group',
      sub: qty > 1 ? `Jumlah bertambah (${qty}x di keranjang)` : 'Foto bareng seluruh member RB',
    })
  },

  merch: (itemName, qty = 1) => {
    bus.emit({
      emoji: '🛍️',
      title: itemName,
      sub: qty > 1 ? `Jumlah bertambah (${qty}x di keranjang)` : 'Merchandise resmi masuk keranjang',
    })
  },

  success: (message, sub) => bus.emit({ emoji: '✅', title: message, sub }),
  error: (message, sub) => bus.emit({ emoji: '❌', title: message, sub }),
  info: (message, sub) => bus.emit({ emoji: 'ℹ️', title: message, sub }),
}



