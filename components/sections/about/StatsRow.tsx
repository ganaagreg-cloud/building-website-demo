import { StatBig } from '@/components/kit/StatBig'

const STATS = [
  { value: '12', label: 'Жилийн туршлага', suffix: '+' },
  { value: '1685', label: 'Амьдарч буй гэр бүл', suffix: '+' },
  { value: '8', label: 'Дуусгасан төсөл' },
]

export function StatsRow() {
  return (
    <section
      aria-label="Тоон үзүүлэлт"
      style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--color-on-dark)' }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8 flex flex-wrap gap-16"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        {STATS.map((s) => (
          <StatBig key={s.label} value={s.value} label={s.label} suffix={s.suffix} theme="dark" />
        ))}
      </div>
    </section>
  )
}
