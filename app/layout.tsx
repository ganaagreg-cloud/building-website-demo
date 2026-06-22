import type { Metadata } from 'next'
import { cormorant, golos, spaceMono } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Шинэ Улаанбаатар',
  description: 'Таны шинэ гэр',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="mn"
      className={`${cormorant.variable} ${golos.variable} ${spaceMono.variable}`}
    >
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}
