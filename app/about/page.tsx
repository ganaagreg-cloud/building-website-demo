import { clientConfig } from '@/config/client.config'
import type { StatsBandSectionConfig } from '@/types'
import { AboutHero } from '@/components/sections/about/AboutHero'
import { StatsRow } from '@/components/sections/about/StatsRow'
import { Story } from '@/components/sections/about/Story'

export default function AboutPage() {
  const statsBand = clientConfig.home?.sections.find(
    (s): s is StatsBandSectionConfig => s.kind === 'statsBand',
  )
  const stats = statsBand?.stats ?? []

  return (
    <main>
      <AboutHero />
      <StatsRow stats={stats} />
      <Story />
    </main>
  )
}
