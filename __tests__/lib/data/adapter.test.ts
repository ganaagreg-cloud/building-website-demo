import { getUnitTypes, getUnits, getUnitsByType } from '@/lib/data/adapter'

describe('getUnitTypes', () => {
  it('returns a non-empty array', async () => {
    const types = await getUnitTypes()
    expect(types.length).toBeGreaterThan(0)
  })

  it('each type has required fields', async () => {
    const types = await getUnitTypes()
    for (const t of types) {
      expect(t).toHaveProperty('id')
      expect(t).toHaveProperty('name')
      expect(Array.isArray(t.sizeRange)).toBe(true)
      expect(t.sizeRange).toHaveLength(2)
      expect(typeof t.priceFrom).toBe('number')
    }
  })
})

describe('getUnits', () => {
  it('returns a non-empty array', async () => {
    const units = await getUnits()
    expect(units.length).toBeGreaterThan(0)
  })

  it('each unit has a valid status', async () => {
    const units = await getUnits()
    const validStatuses = ['available', 'reserved', 'sold']
    for (const u of units) {
      expect(validStatuses).toContain(u.status)
    }
  })

  it('each unit typeId references an existing unitType', async () => {
    const [units, types] = await Promise.all([getUnits(), getUnitTypes()])
    const typeIds = new Set(types.map((t) => t.id))
    for (const u of units) {
      expect(typeIds.has(u.typeId)).toBe(true)
    }
  })
})

describe('getUnitsByType', () => {
  it('returns only units matching typeId', async () => {
    const units = await getUnitsByType('studio')
    expect(units.length).toBeGreaterThan(0)
    for (const u of units) {
      expect(u.typeId).toBe('studio')
    }
  })

  it('returns empty array for unknown typeId', async () => {
    const units = await getUnitsByType('nonexistent')
    expect(units).toHaveLength(0)
  })
})
