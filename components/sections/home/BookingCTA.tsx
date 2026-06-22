import Link from 'next/link'
import { SectionWrapper } from '@/components/layout/SectionWrapper'

export function BookingCTA() {
  return (
    <SectionWrapper number="03">
      <div className="max-w-content mx-auto text-center">
        <h2 className="font-display font-light text-4xl lg:text-5xl mb-6">Үзлэг захиалах</h2>
        <p className="font-body text-lg text-muted mb-8 max-w-reading mx-auto">
          Манай борлуулалтын багтай холбогдож, танд тохирсон орон сууцаа олоорой.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center bg-oak text-on-oak rounded-full px-8 py-3 font-body text-sm hover:bg-[var(--color-oak-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
        >
          Одоо захиалах
        </Link>
      </div>
    </SectionWrapper>
  )
}
