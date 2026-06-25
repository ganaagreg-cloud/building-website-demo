import Image from 'next/image'
import { HoverLift } from '@/components/motion/HoverLift'

interface GalleryProps {
  images: string[]
  altPrefix: string
}

export function Gallery({ images, altPrefix }: GalleryProps) {
  if (images.length === 0) return null

  return (
    <section aria-label="Зургийн цомог">
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: '4rem' }}
      >
        <div
          className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
        >
          {images.map((src, i) => (
            <HoverLift key={src}>
              <div className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: '2px' }}>
                <Image
                  src={src}
                  alt={`${altPrefix} — зураг ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </HoverLift>
          ))}
        </div>
      </div>
    </section>
  )
}
