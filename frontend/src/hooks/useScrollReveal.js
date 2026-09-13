/**
 * useScrollReveal.js
 * Lightweight Intersection Observer hook for scroll-triggered reveal animations.
 *
 * Usage:
 *   const ref = useScrollReveal({ threshold: 0.15, once: true })
 *   <div ref={ref} className="reveal-card">...</div>
 *
 * OR with framer-motion whileInView (simpler, no hook needed):
 *   <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
 *     viewport={{ once: true, amount: 0.2 }} />
 */

import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref to attach to a DOM element.
 * Adds class `is-visible` when the element enters the viewport.
 *
 * @param {Object} opts
 * @param {number} opts.threshold  - 0–1, fraction visible to trigger (default 0.15)
 * @param {boolean} opts.once      - only trigger once (default true)
 * @param {string} opts.rootMargin - IntersectionObserver rootMargin (default '0px 0px -60px 0px')
 */
export const useScrollReveal = ({
  threshold = 0.15,
  once = true,
  rootMargin = '0px 0px -60px 0px',
} = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          if (once) observer.unobserve(el)
        } else if (!once) {
          el.classList.remove('is-visible')
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return ref
}

/**
 * Returns { ref, isVisible } for use with framer-motion or conditional classes.
 */
export const useInView = ({
  threshold = 0.15,
  once = true,
  rootMargin = '0px 0px -60px 0px',
} = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return { ref, isVisible }
}
