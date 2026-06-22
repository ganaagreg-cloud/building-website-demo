import { NextResponse } from 'next/server'

interface ContactBody {
  name?: unknown
  phone?: unknown
  unitType?: unknown
  message?: unknown
}

export async function POST(req: Request) {
  const body = (await req.json()) as ContactBody

  if (!body.name || typeof body.name !== 'string' || !body.phone || typeof body.phone !== 'string') {
    return NextResponse.json(
      { error: 'Нэр болон утасны дугаар заавал шаардлагатай' },
      { status: 400 }
    )
  }

  // Server-side only: integrate Telegram/email notifier here (never expose keys to client)
  console.log('[contact]', {
    name: body.name,
    phone: body.phone,
    unitType: body.unitType,
    message: body.message,
  })

  return NextResponse.json({ ok: true })
}
