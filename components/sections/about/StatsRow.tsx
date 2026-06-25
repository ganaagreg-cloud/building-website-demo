import type { StatItem } from '@/types'
import { StatBig } from '@/components/kit/StatBig'

interface StatsRowProps {
  stats: StatItem[]
}

export function StatsRow({ stats }: StatsRowProps) {
  if (stats.length === 0) return null

  return (
    <section
      aria-label="Тоон үзүүлэлт"
      style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--color-on-dark)' }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8 flex flex-wrap gap-16"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        {stats.map((s) => (
          <StatBig key={s.label} value={s.value} label={s.label} suffix={s.suffix} theme="dark" />
        ))}
      </div>
    </section>
  )
}
