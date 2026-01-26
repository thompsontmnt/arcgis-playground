import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'

import type { CarbonMapperPlume } from '@/api/client'

/**
 * Create a point graphic from a Carbon Mapper plume
 * Renders as colored marker: orange for CH4, blue for CO2
 */
export function createGraphicFromCarbonMapperPlume(
  plume: CarbonMapperPlume,
): Graphic {
  const geometry_json = plume.geometry_json as any
  const [lon, lat] = geometry_json?.coordinates || [0, 0]

  const point = new Point({
    longitude: lon,
    latitude: lat,
  })

  // Color by gas type
  const color = plume.gas === 'CH4' ? [255, 140, 0] : [65, 105, 225] // Orange for CH4, blue for CO2

  const symbol = new SimpleMarkerSymbol({
    color,
    size: 8,
    outline: {
      color: [255, 255, 255],
      width: 1,
    },
  })

  return new Graphic({
    geometry: point,
    symbol,
    attributes: {
      plume_id: plume.plume_id || plume.id,
      gas: plume.gas,
      emission: plume.emission_auto,
      platform: plume.platform,
      instrument: plume.instrument,
      timestamp: plume.scene_timestamp,
      ...plume,
    },
  })
}

/**
 * Create graphics from an array of Carbon Mapper plumes
 */
export function createGraphicsFromCarbonMapperPlumes(
  plumes: Array<CarbonMapperPlume>,
): Array<Graphic> {
  return plumes
    .filter((plume) => plume.plume_bounds && plume.plume_png)
    .map((plume) => {
      try {
        return createGraphicFromCarbonMapperPlume(plume)
      } catch {
        return null
      }
    })
    .filter((g) => g !== null)
}
