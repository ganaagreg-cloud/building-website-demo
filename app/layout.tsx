import type { Metadata } from 'next'
import { cormorant, golos, spaceMono } from './fonts'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { AnimationProvider } from '@/components/motion/AnimationProvider'
import { clientConfig } from '@/config/client.config'
import './globals.css'

export const metadata: Metadata = {
  title: clientConfig.buildingName,
  description: clientConfig.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="mn"
      className={`${cormorant.variable} ${golos.variable} ${spaceMono.variable}`}
    >
      <body className="font-body min-h-screen flex flex-col">
        <LenisProvider>
          <AnimationProvider>
            <Nav />
            <div className="flex-1">{children}</div>
            <Footer />
          </AnimationProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
