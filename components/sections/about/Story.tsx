import { Reveal } from '@/components/motion/Reveal'

interface StoryProps {
  heading?: string
  paragraphs?: string[]
}

const DEFAULT_HEADING = 'Чанар бол бидний гол үнэт зүйл.'
const DEFAULT_PARAGRAPHS = [
  'Монголын орон сууцны зах зээлд итгэлтэй хөгжүүлэгч бид таны гэрийг зөвхөн барилга биш, амьдралын орон зай болгон барьдаг.',
  'Байгалийн материал, гэрлийг дуртай угтдаг архитектур, гар бүрд мэдрэгдэх нарийн ширийн — эдгээр нь бидний хийдэг зүйлийн мөн чанар.',
]

export function Story({
  heading = DEFAULT_HEADING,
  paragraphs = DEFAULT_PARAGRAPHS,
}: StoryProps) {
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
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`font-body ${i > 0 ? 'mt-6' : ''}`}
              style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-muted)' }}
            >
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
