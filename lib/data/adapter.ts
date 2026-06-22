import type { Unit, UnitType } from '@/types'
import {
  getUnitTypesFromConfig,
  getUnitsFromConfig,
  getUnitsByTypeFromConfig,
} from './sources/config'

const source = process.env.DATA_SOURCE ?? 'config'

export async function getUnitTypes(): Promise<UnitType[]> {
  if (source === 'config') return getUnitTypesFromConfig()
  throw new Error(`DATA_SOURCE "${source}" is not yet implemented`)
}

export async function getUnits(): Promise<Unit[]> {
  if (source === 'config') return getUnitsFromConfig()
  throw new Error(`DATA_SOURCE "${source}" is not yet implemented`)
}

export async function getUnitsByType(typeId: string): Promise<Unit[]> {
  if (source === 'config') return getUnitsByTypeFromConfig(typeId)
  throw new Error(`DATA_SOURCE "${source}" is not yet implemented`)
}
