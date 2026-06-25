import { Reveal } from '@/components/motion/Reveal'

export function MapSection() {
  return (
    <section aria-label="Байршлын газрын зураг">
      <Reveal className="max-w-content mx-auto px-4 lg:px-8 pb-12">
        <div
          className="w-full flex items-center justify-center"
          style={{
            height: '420px',
            background: 'var(--color-surface-raised)',
            borderRadius: '2px',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-label="Газрын зураг (удахгүй)"
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                margin: '0 auto 8px',
                boxShadow: '0 0 0 4px rgba(184,148,106,0.25)',
              }}
            />
            <p
              className="font-utility"
              style={{ fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Газрын зураг удахгүй
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
