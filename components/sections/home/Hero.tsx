import Image from 'next/image'
import Link from 'next/link'
import { BLUR_URL } from '@/config/placeholders'

interface HeroProps {
  buildingName: string
  tagline: string
  heroImage?: string
}

export function Hero({ buildingName, tagline, heroImage }: HeroProps) {
  return (
    <section
      aria-label="Hero"
      data-hero-section
      className="relative w-full min-h-[92svh] overflow-hidden"
    >
      {heroImage && (
        <Image
          src={heroImage}
          alt={`${buildingName} барилгын гадна талын зураг`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_URL}
        />
      )}
      {!heroImage && (
        <div className="absolute inset-0 bg-surface-raised" aria-hidden="true" />
      )}

      {/* Cream gradient — heavier bottom-left, fades toward top-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(155deg, transparent 25%, rgba(250,246,239,0.45) 55%, rgba(250,246,239,0.88) 100%)',
        }}
      />

      {/* Content — deliberately lower-left, narrow, off-centre */}
      <div className="absolute bottom-0 left-0 px-8 lg:px-16 pb-16 lg:pb-24 max-w-[600px]">
        <h1
          data-hero-name
          className="font-display font-light text-[var(--color-text)] leading-[1.02]"
          style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
        >
          {buildingName}
        </h1>

        {/* Oak hairline — signature mark under the name */}
        <div
          data-oak-hairline
          aria-hidden="true"
          className="bg-oak mt-3 mb-5"
          style={{ width: '48px', height: '1px', transformOrigin: 'left center' }}
        />

        <p
          data-hero-sub
          className="font-body text-base lg:text-lg text-muted mb-8 max-w-[420px]"
        >
          {tagline}
        </p>

        <Link
          data-hero-cta
          href="#tour"
          className="inline-flex items-center justify-center bg-oak text-on-oak rounded-full px-8 py-3 font-body text-sm hover:bg-[var(--color-oak-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
        >
          Аялалд орох
        </Link>
      </div>

      {/* Subtle floor counter — bottom right */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 right-8 lg:right-16 font-utility text-[10px] tracking-widest text-muted uppercase opacity-60"
      >
        Сүхбаатар дүүрэг · Улаанбаатар
      </div>
    </section>
  )
}
