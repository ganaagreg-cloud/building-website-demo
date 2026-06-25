import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'

export function AboutHero() {
  return (
    <div
      className="max-w-content mx-auto px-4 lg:px-8"
      style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
    >
      <Eyebrow label="Бидний тухай" className="mb-8" />
      <EditorialHeading
        parts={[
          { text: 'Хот байгуулах ' },
          { text: 'урлаг', accent: 'italic' as const },
          { text: '.' },
        ]}
        as="h1"
        style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)' }}
      />
    </div>
  )
}
