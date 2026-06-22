import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  buildingName: string
  tagline: string
  heroImage?: string
}

export function Hero({ buildingName, tagline, heroImage = '/assets/demo/hero/building.jpg' }: HeroProps) {
  return (
    <section
      aria-label="Hero"
      className="relative w-full min-h-[90svh] flex items-end pb-16 px-4 lg:px-8"
    >
      <Image
        src={heroImage}
        alt={`${buildingName} барилгын гадна талын зураг`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Cream-tinted gradient — light, not dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(250,246,239,0.90) 0%, rgba(250,246,239,0.20) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-content w-full mx-auto">
        <h1
          className="font-display font-light mb-4"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)', lineHeight: 1.05 }}
        >
          {buildingName}
        </h1>
        <p className="font-body text-lg text-muted mb-8 max-w-reading">{tagline}</p>
        <Link
          href="#tour"
          className="inline-flex items-center justify-center bg-oak text-on-oak rounded-full px-8 py-3 font-body text-sm hover:bg-[var(--color-oak-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
        >
          Аялалд орох
        </Link>
      </div>
    </section>
  )
}
