import { clientConfig } from '@/config/client.config'

const DEFAULT_LABEL = 'Жишиг дүрслэл'

/**
 * Unobtrusive disclosure for AI-generated sample visualizations.
 * Label comes from config (sampleVisualizationLabel), never hardcoded at
 * the call site. Render only when the asset's isSampleVisualization is on.
 */
export function SampleVizCaption({
  className,
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'dark'
}) {
  const label = clientConfig.sampleVisualizationLabel ?? DEFAULT_LABEL

  return (
    <span
      className={`font-body text-[10px] uppercase tracking-[0.18em] ${className ?? ''}`}
      style={{
        color: tone === 'light' ? 'rgba(255,255,255,0.5)' : 'var(--text-soft)',
      }}
    >
      {label}
    </span>
  )
}
