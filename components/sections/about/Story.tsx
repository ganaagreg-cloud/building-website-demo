import { Reveal } from '@/components/motion/Reveal'

export function Story() {
  return (
    <section aria-label="Бидний түүх">
      <div
        className="max-w-content mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        <Reveal>
          <h2
            className="font-display font-light"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.1 }}
          >
            Чанар бол бидний гол үнэт зүйл.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-body" style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-muted)' }}>
            12 жилийн туршлагатай, Монголын орон сууцны зах зээлд хамгийн их итгэл үзүүлсэн хөгжүүлэгч бид таны гэрийг зөвхөн барилга биш, амьдралын орон зай болгон барьдаг.
          </p>
          <p className="font-body mt-6" style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-muted)' }}>
            Байгалийн материал, гэрлийг дуртай угтдаг архитектур, гар бүрд мэдрэгдэх нарийн ширийн — эдгээр нь бидний хийдэг зүйлийн мөн чанар.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
