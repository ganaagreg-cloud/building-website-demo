import type { Metadata } from 'next'
import { cormorant, golos, spaceMono } from './fonts'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { LenisProvider } from '@/components/layout/LenisProvider'
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
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
