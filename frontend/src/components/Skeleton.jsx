const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200/80 dark:bg-white/10 rounded-xl ${className}`}></div>
  )
}

export default Skeleton
