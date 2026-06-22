import Link from 'next/link'
import { clientConfig } from '@/config/client.config'

const FOOTER_LINKS = [
  { href: '/', label: 'Нүүр' },
  { href: '/residences', label: 'Орон сууц' },
  { href: '/availability', label: 'Боломжтой' },
  { href: '/location', label: 'Байршил' },
  { href: '/about', label: 'Бидний тухай' },
  { href: '/contact', label: 'Холбоо барих' },
]

export function Footer() {
  return (
    <footer className="bg-surface-raised">
      <div className="max-w-content mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="font-display text-2xl mb-2">{clientConfig.buildingName}</p>
          <p className="font-body text-sm text-muted">{clientConfig.tagline}</p>
        </div>
        <div className="flex flex-col gap-4">
          <nav aria-label="Хөл цэс" className="flex flex-col gap-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-muted hover:text-[var(--color-text)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <address className="not-italic font-utility text-[11px] text-muted flex flex-col gap-1 mt-2">
            <span>{clientConfig.contact.address}</span>
            <a href={`tel:${clientConfig.contact.phone}`} className="hover:text-[var(--color-text)] transition-colors">
              {clientConfig.contact.phone}
            </a>
            <a href={`mailto:${clientConfig.contact.email}`} className="hover:text-[var(--color-text)] transition-colors">
              {clientConfig.contact.email}
            </a>
          </address>
        </div>
      </div>
      <div className="border-t border-[rgba(42,39,36,0.10)] px-4 lg:px-8 py-4">
        <p className="font-utility text-[11px] text-muted max-w-content mx-auto">
          © {new Date().getFullYear()} {clientConfig.buildingName}. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </div>
    </footer>
  )
}
