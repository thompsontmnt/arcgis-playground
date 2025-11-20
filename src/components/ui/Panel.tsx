import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PanelProps {
  children: React.ReactNode
  className?: string
}

export function Panel({ children, className }: PanelProps) {
  return (
    <Card
      className={cn(
        'p-3 shadow-lg border rounded-lg bg-[--color-overlay] backdrop-blur',
        'absolute top-4 left-4 z-50 w-[360px]',
        className,
      )}
    >
      {children}
    </Card>
  )
}
