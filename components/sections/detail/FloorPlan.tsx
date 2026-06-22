import Image from 'next/image'
import { SectionWrapper } from '@/components/layout/SectionWrapper'

interface FloorPlanProps {
  src: string
  alt: string
}

export function FloorPlan({ src, alt }: FloorPlanProps) {
  return (
    <SectionWrapper number="01">
      <div className="max-w-content mx-auto">
        <h2 className="font-display font-light text-3xl lg:text-4xl mb-8">Төлөвлөгөө</h2>
        <div className="relative w-full aspect-[4/3] bg-surface-raised">
          <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
        </div>
        <p className="font-utility text-[11px] text-muted mt-3">
          Зураг нь баримтлах зориулалттай бөгөөд жижиг өөрчлөлт гарч болно.
        </p>
      </div>
    </SectionWrapper>
  )
}
