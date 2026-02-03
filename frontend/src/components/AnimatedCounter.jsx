import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const AnimatedCounter = ({ value, duration = 2, suffix = '' }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration })
      return controls.stop
    }
  }, [inView, count, value, duration])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

export default AnimatedCounter
