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
      style={
        active
          ? {
              backgroundColor: 'var(--color-surface-raised)',
              borderColor: 'var(--color-oak)',
              color: 'var(--color-oak)',
              minHeight: '44px',
            }
          : {
              backgroundColor: 'transparent',
              borderColor: 'var(--color-border)',
              minHeight: '44px',
            }
      }
      className={[
        'inline-flex items-center px-4 py-2 rounded-full font-body text-sm border transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)] focus-visible:ring-offset-2',
        active ? 'font-medium' : 'hover:border-[var(--color-oak)]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
