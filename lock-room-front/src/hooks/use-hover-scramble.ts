import { useState, useRef, useCallback } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const randomChar = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]

const isStatic = (char: string) => char === ' ' || char === '-' || char === '_' || char === '.'

export const useHoverScramble = (text: string, options?: { duration?: number }) => {
  const duration = options?.duration ?? 500
  const [output, setOutput] = useState(text)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const isAnimating = useRef(false)

  const start = useCallback(() => {
    if (isAnimating.current) return

    isAnimating.current = true
    startRef.current = null

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp

      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const revealedCount = Math.floor(progress * text.length)

      setOutput(
        text
          .split('')
          .map((char, i) => {
            if (i < revealedCount) return char
            if (isStatic(char)) return char
            return randomChar()
          })
          .join(''),
      )

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        isAnimating.current = false
      }
    }

    frameRef.current = requestAnimationFrame(animate)
  }, [text, duration])

  const reset = useCallback(() => {
    if (isAnimating.current) return
    cancelAnimationFrame(frameRef.current)
    setOutput(text)
  }, [text])

  return {
    output,
    handlers: {
      onMouseEnter: start,
      onMouseLeave: reset,
    },
  }
}
