import { SectionWrapper } from '@/components/layout/SectionWrapper'

export function Features({ features }: { features: string[] }) {
  return (
    <SectionWrapper number="02">
      <div className="max-w-content mx-auto">
        <h2 className="font-display font-light text-3xl lg:text-4xl mb-8">Онцлогууд</h2>
        {features.length === 0 ? (
          <p className="font-body text-sm text-muted">Мэдээлэл байхгүй байна.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 font-body text-base">
                <span className="text-oak mt-0.5 select-none" aria-hidden="true">·</span>
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionWrapper>
  )
}
