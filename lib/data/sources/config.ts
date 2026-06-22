import { clientConfig } from '@/config/client.config'
import type { Unit, UnitType } from '@/types'

export async function getUnitTypesFromConfig(): Promise<UnitType[]> {
  return clientConfig.unitTypes
}

export async function getUnitsFromConfig(): Promise<Unit[]> {
  return clientConfig.units
}

export async function getUnitsByTypeFromConfig(typeId: string): Promise<Unit[]> {
  return clientConfig.units.filter((u) => u.typeId === typeId)
}
