import { SectionWrapper } from '@/components/layout/SectionWrapper'

const STATS = [
  { value: '12', label: 'Дууссан төсөл' },
  { value: '2,400+', label: 'Хүргэсэн орон сууц' },
  { value: '15', label: 'Жилийн туршлага' },
]

const VALUES = [
  { label: 'ЧАНАР', body: 'Олон улсын стандарт материал, мастер гүйцэтгэл.' },
  { label: 'ИЛ ТОД', body: 'Бүх зардал, хугацаа, нөхцөл тодорхой.' },
  { label: 'ТОГТВОРТОЙ', body: 'Эрчим хүчний хэмнэлттэй, урт насжилттай барилга.' },
]

export default function AboutPage() {
  return (
    <main>
      <header className="max-w-content mx-auto px-4 lg:px-8 pt-16 pb-8">
        <h1
          className="font-display font-light mb-6"
          style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)', lineHeight: 1.05 }}
        >
          Бидний тухай
        </h1>
        <p className="font-body text-lg text-muted max-w-reading">
          Монголын хамгийн итгэлтэй орон сууцны хөгжүүлэгч.
          Бид чанар, ил тод байдал, урт хугацааны үнэ цэнийг тэргүүнд тавьдаг.
        </p>
      </header>

      {/* Story */}
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className="bg-surface-raised aspect-[4/3]"
            role="img"
            aria-label="Барилгын зураг"
          />
          <div>
            <h2 className="font-display font-light text-4xl mb-4">Манай түүх</h2>
            <p className="font-body text-base text-muted">
              2009 онд үүсгэн байгуулагдсан бидний компани Улаанбаатарт 12 гаруй амжилттай
              төсөл хэрэгжүүлсэн. Чанар болон гоо зүйн зохицлыг эрхэмлэдэг.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper number="02" className="bg-surface-raised">
        <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {VALUES.map((v) => (
            <div key={v.label}>
              <p className="font-utility text-[11px] tracking-widest text-muted mb-2">{v.label}</p>
              <p className="font-body text-base">{v.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Track record */}
      <SectionWrapper number="03">
        <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.value}>
              <p
                className="font-display font-light mb-2"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', lineHeight: 1 }}
              >
                {s.value}
              </p>
              <p className="font-utility text-[12px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </main>
  )
}
