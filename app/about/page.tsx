import { AboutHero } from '@/components/sections/about/AboutHero'
import { StatsRow } from '@/components/sections/about/StatsRow'
import { Story } from '@/components/sections/about/Story'

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <StatsRow />
      <Story />
    </main>
  )
}
