import Image from 'next/image'

interface TourFallbackProps {
  frames: string[]
}

export function TourFallback({ frames }: TourFallbackProps) {
  const picks: string[] = frames.length >= 3
    ? [
        frames[0] ?? '',
        frames[Math.floor(frames.length / 2)] ?? '',
        frames[frames.length - 1] ?? '',
      ].filter(Boolean)
    : [...frames]

  if (picks.length === 0) return null

  return (
    <section
      aria-label="Орон сууцны аялал"
      className="w-full bg-surface-raised py-16 px-4 lg:px-8"
    >
      <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {picks.map((src, i) => (
          <div key={i} className="aspect-[4/3] relative overflow-hidden rounded-sm">
            <Image
              src={src}
              alt={`Орон сууцны дотор тал ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
