import { motion } from 'framer-motion'

export default function ScrollFade({ direction }: { direction: 'left' | 'right' }) {
  return (
    <motion.div
      className={`scroll-fade ${direction}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  )
}