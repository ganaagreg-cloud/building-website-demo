import Image from 'next/image'

interface GalleryProps {
  images: string[]
  altPrefix: string
}

export function Gallery({ images, altPrefix }: GalleryProps) {
  if (images.length === 0) return null

  return (
    <section aria-label="Зургийн цомог">
      {images.length === 1 ? (
        <div className="relative" style={{ aspectRatio: '16/9' }}>
          <Image
            src={images[0]!}
            alt={`${altPrefix} — дотоод зураг`}
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2" style={{ gap: '2px' }}>
          {images.map((src, i) => (
            <div key={src} className="relative" style={{ aspectRatio: '4/3' }}>
              <Image
                src={src}
                alt={`${altPrefix} — зураг ${i + 1}`}
                fill
                className="object-cover"
                sizes="50vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
