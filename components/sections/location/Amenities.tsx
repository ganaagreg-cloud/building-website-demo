import { SectionWrapper } from '@/components/layout/SectionWrapper'

const AMENITIES = [
  { category: 'Сургууль', distance: '5 мин', description: 'Олон улсын сургууль, цэцэрлэг' },
  { category: 'Нийтийн тээвэр', distance: '3 мин', description: 'Автобусны буудал, метро' },
  { category: 'Худалдааны төв', distance: '10 мин', description: 'State Department Store, Sky Mall' },
  { category: 'Цэцэрлэгт хүрээлэн', distance: '8 мин', description: 'Ногоон зай, явган хүний зам' },
]

export function Amenities() {
  return (
    <SectionWrapper number="01">
      <div className="max-w-content mx-auto">
        <h2 className="font-display font-light text-4xl lg:text-5xl mb-10">Дэд бүтэц</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {AMENITIES.map((a) => (
            <div key={a.category}>
              <p className="font-utility text-[11px] text-muted uppercase tracking-wider mb-1">
                {a.category} · {a.distance}
              </p>
              <p className="font-body text-sm">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
