import { useHoverScramble } from '@/hooks/use-hover-scramble'

interface ScrambleTextProps {
  children: string
  duration?: number
  className?: string
  style?: React.CSSProperties
  as?: keyof React.JSX.IntrinsicElements
}

export const ScrambleText = ({
  children,
  duration,
  className,
  style,
  as: Tag = 'span',
}: ScrambleTextProps) => {
  const { output, handlers } = useHoverScramble(children, { duration })

  return (
    <Tag className={className} style={style} {...handlers}>
      {output}
    </Tag>
  )
}
