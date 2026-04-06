import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

const COLORS = ['#FF6B9D', '#FFD700', '#9B59B6', '#00D2FF', '#FF8C00', '#00FF7F', '#FF4500']

export function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (show) {
      setParticles(
        Array.from({ length: 60 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1,
        }))
      )
    } else {
      setParticles([])
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{ left: `${p.x}%`, backgroundColor: p.color }}
              initial={{ y: '-10vh', rotate: p.rotation, scale: p.scale, opacity: 1 }}
              animate={{
                y: '110vh',
                rotate: p.rotation + 720,
                opacity: [1, 1, 0],
                x: [(Math.random() - 0.5) * 200],
              }}
              transition={{ duration: 2 + Math.random() * 2, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
