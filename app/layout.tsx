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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-oak)] focus:text-white focus:text-sm focus:font-body focus:rounded-md focus:outline-none"
        >
          Үндсэн агуулга руу орох
        </a>
        <LenisProvider>
          <AnimationProvider>
            <Nav />
            <div id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</div>
            <Footer />
          </AnimationProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
