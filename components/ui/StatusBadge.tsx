import type { UnitStatus } from '@/types'

const LABELS: Record<UnitStatus, string> = {
  available: 'Боломжтой',
  reserved: 'Захиалагдсан',
  sold: 'Зарагдсан',
}

interface StatusBadgeProps {
  status: UnitStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'sold') {
    return (
      <span className="font-utility text-[11px] text-[rgba(42,39,36,0.40)]">
        {LABELS.sold}
      </span>
    )
  }

  const styles: Record<Exclude<UnitStatus, 'sold'>, string> = {
    available: 'text-sage border-sage',
    reserved: 'text-muted border-[rgba(42,39,36,0.20)]',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-utility text-[11px] rounded-sm border ${styles[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}
