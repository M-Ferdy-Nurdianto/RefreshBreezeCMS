import { motion } from 'framer-motion'

const AnimatedBackground = () => {
  const floatingShapes = [
    { size: 300, x: '10%', y: '10%', duration: 20, delay: 0, color: 'from-custom-green/10 to-custom-mint/20' },
    { size: 200, x: '80%', y: '20%', duration: 25, delay: 2, color: 'from-custom-mint/15 to-custom-sage/10' },
    { size: 250, x: '60%', y: '70%', duration: 22, delay: 4, color: 'from-custom-green/8 to-green-300/15' },
    { size: 150, x: '20%', y: '80%', duration: 18, delay: 1, color: 'from-custom-sage/10 to-custom-mint/15' },
    { size: 180, x: '90%', y: '60%', duration: 23, delay: 3, color: 'from-green-200/10 to-custom-green/5' },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${shape.color} blur-3xl`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-custom-green/5 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default AnimatedBackground
