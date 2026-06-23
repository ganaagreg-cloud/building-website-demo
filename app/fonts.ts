import { Cormorant_Garamond, Golos_Text, Space_Mono } from 'next/font/google'

export const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['300', '400'],
  variable: '--font-display',
  display: 'swap',
})

export const golos = Golos_Text({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-utility',
  display: 'swap',
})
