interface FilterPillProps {
  label: string
  active: boolean
  onClick: () => void
}

export function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'inline-flex items-center px-4 py-2 rounded-full font-body text-sm transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2',
        active
          ? 'bg-surface-raised border border-[rgba(42,39,36,0.40)] font-medium'
          : 'bg-transparent border border-[rgba(42,39,36,0.20)] hover:border-[rgba(42,39,36,0.40)]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
