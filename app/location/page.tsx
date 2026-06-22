import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { Amenities } from '@/components/sections/location/Amenities'

export default function LocationPage() {
  return (
    <main>
      {/* Map placeholder — replace with <iframe> or static map image */}
      <section
        aria-label="Байршлын газрын зураг"
        className="w-full h-[50vh] bg-surface-raised flex items-center justify-center border-b border-[var(--color-border)]"
      >
        <p className="font-utility text-[12px] text-muted tracking-widest uppercase">
          Газрын зураг — байршил
        </p>
      </section>

      <Amenities />

      <SectionWrapper number="02">
        <div className="max-w-reading mx-auto">
          <h2 className="font-display font-light text-4xl lg:text-5xl mb-6">Дүүрэг</h2>
          <p className="font-body text-lg text-muted">
            Сүхбаатар дүүрэг нь Улаанбаатарын төвийн хамгийн тохиромжтой, дэд бүтэц сайтай
            байршлуудын нэг юм. Бүх зүйл алхам зайд.
          </p>
        </div>
      </SectionWrapper>
    </main>
  )
}
