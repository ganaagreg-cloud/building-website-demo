import { Reveal } from '@/components/motion/Reveal'

const AMENITIES = [
  { label: 'Хуурай цэвэрлэгээ', distance: '2 мин' },
  { label: 'Супермаркет', distance: '3 мин' },
  { label: 'Метро буудал', distance: '5 мин' },
  { label: 'Олон улсын сургууль', distance: '8 мин' },
  { label: 'Эмнэлэг', distance: '10 мин' },
  { label: 'Цэцэрлэгт хүрээлэн', distance: '12 мин' },
]

export function Amenities() {
  return (
    <section aria-label="Ойр орчны үйлчилгээ">
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)', borderTop: '1px solid var(--color-border)' }}
      >
        <h2
          className="font-display font-light mb-10"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
        >
          Ойр орчин
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AMENITIES.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <div
                className="flex items-center justify-between"
                style={{ paddingBlock: '1rem', borderBottom: '1px solid var(--color-border)' }}
              >
                <span className="font-body" style={{ fontSize: '0.95rem' }}>{item.label}</span>
                <span
                  className="font-utility"
                  style={{ fontSize: '11px', color: 'var(--color-oak)', letterSpacing: '0.04em' }}
                >
                  {item.distance}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
